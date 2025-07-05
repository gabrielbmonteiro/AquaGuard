package com.aqua.guard.monitoramento.api.v1.dto;

public record ConfiguracaoDispositivoDTO(
        String chaveApi,
        String urlReport,
        Integer intervaloReportSegundos
) {}