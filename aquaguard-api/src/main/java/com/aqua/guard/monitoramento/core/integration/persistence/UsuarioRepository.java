package com.aqua.guard.monitoramento.core.integration.persistence;

import com.aqua.guard.monitoramento.core.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

}
