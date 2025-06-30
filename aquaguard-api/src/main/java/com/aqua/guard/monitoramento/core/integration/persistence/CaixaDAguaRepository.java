package com.aqua.guard.monitoramento.core.integration.persistence;

import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CaixaDAguaRepository extends JpaRepository<CaixaDAgua, UUID> {

    Optional<CaixaDAgua> findBySerialNumber(String serialNumber);

    Optional<CaixaDAgua> findByChaveApi(String chaveApi);

    List<CaixaDAgua> findAllByUsuario(Usuario usuario);
}
