package com.aqua.guard.monitoramento.api.v1.ws;

import com.aqua.guard.monitoramento.api.v1.dto.DadosConfiguracaoDispositivo;
import com.aqua.guard.monitoramento.core.service.ProvisionamentoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provisionamento")
public class ProvisionamentoController {

    @Autowired
    private ProvisionamentoService provisionamentoService;

    @GetMapping("/configuracao/{serialNumber}")
    public ResponseEntity<DadosConfiguracaoDispositivo> getConfiguracao(@PathVariable String serialNumber) {
        try {
            var config = provisionamentoService.obterConfiguracao(serialNumber);
            return ResponseEntity.ok(config);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}