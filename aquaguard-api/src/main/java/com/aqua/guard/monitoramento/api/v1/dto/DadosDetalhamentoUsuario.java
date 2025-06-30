package com.aqua.guard.monitoramento.api.v1.dto;

import com.aqua.guard.monitoramento.core.entity.Usuario;

import java.util.UUID;

public record DadosDetalhamentoUsuario(
        UUID id,
        String nomeCompleto,
        String email,
        String telefone
) {

    public DadosDetalhamentoUsuario(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getTelefone()
        );
    }
}