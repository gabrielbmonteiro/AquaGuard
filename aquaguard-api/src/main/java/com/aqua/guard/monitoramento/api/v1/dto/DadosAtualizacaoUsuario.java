package com.aqua.guard.monitoramento.api.v1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record DadosAtualizacaoUsuario(
        String nomeCompleto,

        @Email(message = "O formato do email é inválido.")
        String email,

        @Size(min = 8, message = "A nova senha deve ter no mínimo 8 caracteres.")
        String senha
) {}