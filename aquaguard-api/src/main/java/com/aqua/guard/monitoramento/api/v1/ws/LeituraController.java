package com.aqua.guard.monitoramento.api.v1.ws;

import com.aqua.guard.monitoramento.api.v1.dto.DadosLeituraEmbarcado;
import com.aqua.guard.monitoramento.core.entity.CaixaDAgua;
import com.aqua.guard.monitoramento.core.service.LeituraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leituras")
public class LeituraController {

    @Autowired
    private LeituraService leituraService;

    @PostMapping
    @Transactional
    public ResponseEntity<Void> registrarLeitura(
            @RequestBody @Valid DadosLeituraEmbarcado dados,
            @AuthenticationPrincipal CaixaDAgua caixaAutenticada
    ) {
        leituraService.salvarLeitura(caixaAutenticada, dados.volumeLitros());
        return ResponseEntity.noContent().build();
    }
}