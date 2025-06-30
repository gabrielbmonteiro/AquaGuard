package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.entity.LeituraVolume;
import com.aqua.guard.monitoramento.core.integration.persistence.LeituraVolumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LeituraService {

    @Autowired
    private LeituraVolumeRepository leituraVolumeRepository;

    public void salvarLeitura(CaixaDAgua caixaAutenticada, BigDecimal volumeLitros) {
        var novaLeitura = new LeituraVolume(caixaAutenticada, volumeLitros);
        leituraVolumeRepository.save(novaLeitura);
    }

}