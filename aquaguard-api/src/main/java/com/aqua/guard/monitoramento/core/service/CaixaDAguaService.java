package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.api.v1.dto.*;
import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.entity.LeituraVolume;
import com.aqua.guard.monitoramento.core.entity.Usuario;
import com.aqua.guard.monitoramento.core.integration.persistence.CaixaDAguaRepository;
import com.aqua.guard.monitoramento.core.integration.persistence.LeituraVolumeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CaixaDAguaService {

    @Autowired
    private CaixaDAguaRepository caixaDAguaRepository;

    @Autowired
    private LeituraVolumeRepository leituraRepository;

    public CaixaDAgua parearDispositivo(DadosPareamentoDispositivo dados, Usuario usuario) {
        if(caixaDAguaRepository.findBySerialNumber(dados.serialNumberDispositivo()).isPresent()){
            throw new DataIntegrityViolationException("Dispositivo com este serial já foi cadastrado.");
        }
        CaixaDAgua novaCaixa = new CaixaDAgua(dados, usuario);
        caixaDAguaRepository.save(novaCaixa);

        return novaCaixa;
    }

    @Transactional
    public CaixaDAgua atualizarInformacoes(UUID id, Usuario usuarioAutenticado, DadosAtualizacaoCaixaDAgua dados) {
        var caixa = validarAcessoUsuario(id, usuarioAutenticado);
        caixa.atualizarInformacoes(dados);

        return caixa;
    }

    @Transactional
    public void excluir(UUID id, Usuario usuarioAutenticado) {
        var caixa = validarAcessoUsuario(id, usuarioAutenticado);
        caixaDAguaRepository.delete(caixa);
    }

    public List<DadosDetalhamentoCaixaDAgua> listar(Usuario usuarioAutenticado) {
        return caixaDAguaRepository.findAllByUsuario(usuarioAutenticado)
                .stream()
                .map(DadosDetalhamentoCaixaDAgua::new)
                .collect(Collectors.toList());
    }

    public DadosDetalhamentoCompletoCaixaDAgua detalhar(UUID id, Usuario usuarioAutenticado) {
        var caixa = validarAcessoUsuario(id, usuarioAutenticado);
        var ultimaLeitura = leituraRepository
                .findFirstByCaixaDAguaOrderByDataHoraLeituraDesc(caixa)
                .orElse(null);

        return new DadosDetalhamentoCompletoCaixaDAgua(caixa, ultimaLeitura);
    }

    public DadosAnaliseCaixaDAgua analisarConsumo(UUID id, Usuario usuarioAutenticado, LocalDateTime inicio, LocalDateTime fim) {
        var caixa = validarAcessoUsuario(id, usuarioAutenticado);
        var leituras = leituraRepository.findAllByCaixaDAguaAndDataHoraLeituraBetweenOrderByDataHoraLeituraAsc(caixa, inicio, fim);

        if (leituras.isEmpty() || leituras.size() < 2) {
            return new DadosAnaliseCaixaDAgua(BigDecimal.ZERO, BigDecimal.ZERO, "Dados insuficientes", List.of());
        }

        BigDecimal consumoMedio = calcularConsumoMedioDiario(leituras, inicio, fim);
        BigDecimal picoDeConsumo = calcularPicoDeConsumo(leituras);
        String previsaoEsvaziamento = calcularPrevisaoEsvaziamento(leituras.get(leituras.size() - 1).getVolumeLitros(), consumoMedio);
        var pontosGrafico = mapearLeiturasParaGrafico(leituras);

        return new DadosAnaliseCaixaDAgua(consumoMedio, picoDeConsumo, previsaoEsvaziamento, pontosGrafico);
    }

    /**
     * Valida se o usuário tem permissão para acessar a caixa d'água e a retorna.
     */
    private CaixaDAgua validarAcessoUsuario(UUID id, Usuario usuarioAutenticado) {
        var caixa = caixaDAguaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Caixa d'água não encontrada."));

        if (!caixa.getUsuario().getId().equals(usuarioAutenticado.getId())) {
            throw new AccessDeniedException("Usuário não tem permissão para acessar esta caixa d'água.");
        }

        return caixa;
    }

    /**
     * Mapeia a lista de entidades LeituraVolume para uma lista de pontos para o gráfico.
     */
    private List<DadosAnaliseCaixaDAgua.PontoGrafico> mapearLeiturasParaGrafico(List<LeituraVolume> leituras) {
        return leituras.stream()
                .map(l -> new DadosAnaliseCaixaDAgua.PontoGrafico(l.getDataHoraLeitura(), l.getVolumeLitros()))
                .collect(Collectors.toList());
    }

    /**
     * Calcula o consumo médio diário com base nas leituras do período.
     */
    private BigDecimal calcularConsumoMedioDiario(List<LeituraVolume> leituras, LocalDateTime inicio, LocalDateTime fim) {
        BigDecimal consumoTotal = leituras.get(0).getVolumeLitros().subtract(leituras.get(leituras.size() - 1).getVolumeLitros());
        long dias = Duration.between(inicio, fim).toDays();
        dias = dias == 0 ? 1 : dias; // Evita divisão por zero para períodos menores que 1 dia

        return consumoTotal.divide(BigDecimal.valueOf(dias), 2, RoundingMode.HALF_UP);
    }

    /**
     * Encontra a maior queda de volume entre duas leituras consecutivas.
     */
    private BigDecimal calcularPicoDeConsumo(List<LeituraVolume> leituras) {
        BigDecimal picoDeConsumo = BigDecimal.ZERO;
        for (int i = 1; i < leituras.size(); i++) {
            BigDecimal consumoNoIntervalo = leituras.get(i - 1).getVolumeLitros().subtract(leituras.get(i).getVolumeLitros());
            if (consumoNoIntervalo.compareTo(picoDeConsumo) > 0) {
                picoDeConsumo = consumoNoIntervalo;
            }
        }

        return picoDeConsumo;
    }

    /**
     * Estima o número de dias restantes com base no consumo médio.
     */
    private String calcularPrevisaoEsvaziamento(BigDecimal volumeAtual, BigDecimal consumoMedio) {
        if (consumoMedio.compareTo(BigDecimal.ZERO) <= 0) {
            return "Consumo zerado";
        }
        BigDecimal diasRestantes = volumeAtual.divide(consumoMedio, 0, RoundingMode.DOWN);

        return "Aproximadamente " + diasRestantes.intValue() + " dias restantes.";
    }

}