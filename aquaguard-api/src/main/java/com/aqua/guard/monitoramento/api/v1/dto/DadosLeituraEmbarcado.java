package com.aqua.guard.monitoramento.api.v1.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record DadosLeituraEmbarcado(
        @NotNull @PositiveOrZero
        BigDecimal volumeLitros
) {}