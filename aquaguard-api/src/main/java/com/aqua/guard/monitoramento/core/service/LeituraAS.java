package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.entity.LeituraVolume;
import com.aqua.guard.monitoramento.core.persistence.LeituraVolumeEC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class LeituraAS {

    @Autowired
    private LeituraVolumeEC leituraVolumeEC;

    public void salvarLeitura(CaixaDAgua caixaAutenticada, BigDecimal volumeLitros) {
        if (volumeLitros.compareTo(caixaAutenticada.getCapacidade()) > 0) {
            throw new IllegalArgumentException("Volume recebido (" + volumeLitros + ") é maior que a capacidade da caixa (" + caixaAutenticada.getCapacidade() + ").");
        }

        var novaLeitura = new LeituraVolume(caixaAutenticada, volumeLitros);
        leituraVolumeEC.save(novaLeitura);
    }

}