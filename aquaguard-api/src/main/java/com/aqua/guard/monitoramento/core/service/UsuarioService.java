package com.aqua.guard.monitoramento.core.service;

import com.aqua.guard.monitoramento.api.v1.dto.DadosAtualizacaoUsuario;
import com.aqua.guard.monitoramento.api.v1.dto.DadosCadastroUsuario;
import com.aqua.guard.monitoramento.core.integration.persistence.UsuarioRepository;
import com.aqua.guard.monitoramento.core.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarNovoUsuario(DadosCadastroUsuario dados) {
        if (repository.findByEmail(dados.email()).isPresent()) {
            throw new IllegalStateException("O email fornecido já está em uso.");
        }
        String senhaHasheada = passwordEncoder.encode(dados.senha());
        var novoUsuario = new Usuario(dados, senhaHasheada);

        return repository.save(novoUsuario);
    }

    public void excluirConta(Usuario usuario) {
        repository.delete(usuario);
    }

    public Usuario atualizarInformacoes(Usuario usuarioAutenticado, DadosAtualizacaoUsuario dados) {
        if (dados.email() != null && !dados.email().equalsIgnoreCase(usuarioAutenticado.getEmail())) {
            if (repository.findByEmail(dados.email()).isPresent()) {
                throw new IllegalStateException("O email fornecido já está em uso por outra conta.");
            }
        }
        usuarioAutenticado.atualizarInformacoes(dados, passwordEncoder);

        return repository.save(usuarioAutenticado);
    }

}