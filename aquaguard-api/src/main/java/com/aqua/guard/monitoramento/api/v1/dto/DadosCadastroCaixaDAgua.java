package com.aqua.guard.monitoramento.api.v1.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * DTO (Data Transfer Object) para receber os dados de cadastro de uma nova Caixa D'Água.
 * Usado no corpo da requisição POST. A anotação @Valid no controller aciona estas validações.
 */
public record DadosCadastroCaixaDAgua(
        @NotBlank
        String nome,

        @NotBlank(message = "O ID do dispositivo é obrigatório.")
        String idDispositivo,

        @NotNull
        @Positive
        BigDecimal capacidade,

        @Positive
        BigDecimal metaDiaria,

        @Positive
        BigDecimal metaSemanal,

        @Positive
        BigDecimal metaMensal
) {
}
