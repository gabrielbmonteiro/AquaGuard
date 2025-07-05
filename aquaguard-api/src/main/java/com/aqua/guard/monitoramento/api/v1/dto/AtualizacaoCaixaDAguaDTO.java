package com.aqua.guard.monitoramento.api.v1.dto;

import com.aqua.guard.monitoramento.core.enums.FrequenciaAtualizacao;
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
        BigDecimal metaMensal,
        FrequenciaAtualizacao frequenciaAtualizacao
) {}