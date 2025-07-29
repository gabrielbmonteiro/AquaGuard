package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.entity.LeituraVolume;
import com.aqua.guard.monitoramento.core.persistence.CaixaDAguaEC;
import com.aqua.guard.monitoramento.core.persistence.LeituraVolumeEC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
public class SimuladorIoTInteligente {

    @Autowired
    private CaixaDAguaEC caixaRepository;
    
    @Autowired 
    private LeituraVolumeEC leituraRepository;
    
    @Scheduled(fixedRate = 10000) // A cada 10 segundos para teste rápido
    public void simularDadosRealistasPorUsuario() {
        // Buscar todas as caixas ativas de todos os usuários
        List<CaixaDAgua> todasCaixas = caixaRepository.findByAtivoTrue();
        
        System.out.println("🤖 Simulador IoT: Processando " + todasCaixas.size() + " caixas...");
        
        for (CaixaDAgua caixa : todasCaixas) {
            try {
                simularLeituraPorCaixa(caixa);
            } catch (Exception e) {
                System.err.println("Erro ao simular dados para caixa " + caixa.getId() + ": " + e.getMessage());
            }
        }
    }
    
    private void simularLeituraPorCaixa(CaixaDAgua caixa) {
        // Pegar última leitura para continuidade
        Optional<LeituraVolume> ultimaLeituraOpt = leituraRepository
            .findFirstByCaixaDAguaOrderByDataHoraLeituraDesc(caixa);
        
        BigDecimal capacidadeTotal = caixa.getCapacidade();
        float capacidadeTotalFloat = capacidadeTotal.floatValue();
        float nivelAtual;
        
        if (ultimaLeituraOpt.isPresent()) {
            nivelAtual = ultimaLeituraOpt.get().getVolumeLitros().floatValue();
        } else {
            // Primeira leitura - começar com 80% da capacidade
            nivelAtual = capacidadeTotalFloat * 0.8f;
        }
        
        // MODO TESTE: Simular consumo alto para testar níveis baixos
        float consumo = calcularConsumoRealistico(capacidadeTotalFloat) * 5; // 5x mais consumo
        float novoNivel = Math.max(0, nivelAtual - consumo);
        
        // DESABILITADO TEMPORARIAMENTE: reabastecimento para testar níveis baixos
        /*
        if (novoNivel < capacidadeTotalFloat * 0.1f && Math.random() < 0.3) {
            novoNivel = capacidadeTotalFloat * (0.7f + (float)(Math.random() * 0.2f)); // 70-90%
            System.out.println("🚰 Caixa " + caixa.getNome() + " foi reabastecida para " + 
                             Math.round(novoNivel) + "L");
        }
        */
        
        // Simular variações de temperatura realistas
        float temperatura = calcularTemperaturaRealista();
        
        // Simular qualidade da água baseada no nível
        String qualidade = calcularQualidadeAgua(novoNivel, capacidadeTotalFloat);
        
        // Salvar nova leitura
        LeituraVolume novaLeitura = new LeituraVolume();
        novaLeitura.setCaixaDAgua(caixa);
        novaLeitura.setVolumeLitros(BigDecimal.valueOf(novoNivel));
        novaLeitura.setDataHoraLeitura(LocalDateTime.now());
        
        leituraRepository.save(novaLeitura);
        
        float percentual = (novoNivel / capacidadeTotalFloat) * 100;
        
        System.out.println("📊 " + caixa.getNome() + " (" + caixa.getUsuario().getEmail() + 
                          ") - " + Math.round(novoNivel) + "L/" + Math.round(capacidadeTotalFloat) + 
                          "L (" + Math.round(percentual) + "%) - " + qualidade);
    }
    
    private float calcularConsumoRealistico(float capacidadeTotal) {
        LocalTime agora = LocalTime.now();
        
        // Consumo proporcional à capacidade da caixa
        float fatorCapacidade = capacidadeTotal / 1000f; // Base: 1000L
        
        // Consumo maior durante o dia (6h-22h)
        if (agora.isAfter(LocalTime.of(6, 0)) && agora.isBefore(LocalTime.of(22, 0))) {
            // Horário de pico: 5-20L por minuto (ajustado pela capacidade)
            return (float) ((Math.random() * 15 + 5) * fatorCapacidade);
        } else {
            // Noite: 1-6L por minuto (ajustado pela capacidade)
            return (float) ((Math.random() * 5 + 1) * fatorCapacidade);
        }
    }
    
    private float calcularTemperaturaRealista() {
        LocalTime agora = LocalTime.now();
        
        // Temperatura varia conforme horário do dia
        if (agora.isAfter(LocalTime.of(12, 0)) && agora.isBefore(LocalTime.of(18, 0))) {
            return 26f + (float)(Math.random() * 4); // 26-30°C (tarde quente)
        } else if (agora.isAfter(LocalTime.of(0, 0)) && agora.isBefore(LocalTime.of(6, 0))) {
            return 18f + (float)(Math.random() * 4); // 18-22°C (madrugada fria)
        } else {
            return 22f + (float)(Math.random() * 4); // 22-26°C (normal)
        }
    }
    
    private String calcularQualidadeAgua(float nivel, float capacidade) {
        float percentual = (nivel / capacidade) * 100;
        
        if (percentual < 5) {
            return "CRÍTICA"; // Muito pouca água = alta concentração
        } else if (percentual < 15) {
            return "RUIM"; // Pouca água = qualidade degradada
        } else if (percentual > 85) {
            return "EXCELENTE"; // Água fresca e abundante
        } else if (percentual < 30) {
            return Math.random() > 0.6 ? "REGULAR" : "RUIM";
        } else {
            return Math.random() > 0.8 ? "REGULAR" : "BOA";
        }
    }
}
