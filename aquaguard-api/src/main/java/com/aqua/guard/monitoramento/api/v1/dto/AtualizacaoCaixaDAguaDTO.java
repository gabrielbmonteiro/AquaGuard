package com.aqua.guard.monitoramento.api.v1.dto;

import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record AtualizacaoCaixaDAguaDTO(
        String nome,
        @Positive
        BigDecimal capacidade,
        @Positive
        BigDecimal metaDiaria,
        @Positive
        BigDecimal metaSemanal,
        @Positive
        BigDecimal metaMensal
) {}