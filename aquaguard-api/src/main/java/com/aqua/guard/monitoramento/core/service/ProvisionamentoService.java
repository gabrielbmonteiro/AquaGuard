package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.api.v1.dto.DadosConfiguracaoDispositivo;
import com.aqua.guard.monitoramento.core.integration.persistence.CaixaDAguaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProvisionamentoService {

    @Autowired
    private CaixaDAguaRepository caixaDAguaRepository;

    public DadosConfiguracaoDispositivo obterConfiguracao(String serialNumber) {
        var caixa = caixaDAguaRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new EntityNotFoundException("Dispositivo não pareado."));

        return new DadosConfiguracaoDispositivo(caixa.getChaveApi(), "/api/leituras");
    }

}