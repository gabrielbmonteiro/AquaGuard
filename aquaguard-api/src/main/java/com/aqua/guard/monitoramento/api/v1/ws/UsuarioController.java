package com.aqua.guard.monitoramento.api.v1.ws;

import com.aqua.guard.monitoramento.api.v1.dto.DadosAtualizacaoUsuario;
import com.aqua.guard.monitoramento.api.v1.dto.DadosDetalhamentoUsuario;
import com.aqua.guard.monitoramento.core.entity.Usuario;
import com.aqua.guard.monitoramento.core.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<DadosDetalhamentoUsuario> getMyProfile(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        var dadosUsuario = new DadosDetalhamentoUsuario(usuarioAutenticado);
        return ResponseEntity.ok(dadosUsuario);
    }

    @PutMapping("/me")
    @Transactional
    public ResponseEntity<DadosDetalhamentoUsuario> atualizarMinhaConta(
            @AuthenticationPrincipal Usuario usuarioAutenticado,
            @RequestBody @Valid DadosAtualizacaoUsuario dados
    ) {
        var usuarioAtualizado = usuarioService.atualizarInformacoes(usuarioAutenticado, dados);
        return ResponseEntity.ok(new DadosDetalhamentoUsuario(usuarioAtualizado));
    }

}