package com.aqua.guard.monitoramento.api.v1.ws;

import com.aqua.guard.monitoramento.api.v1.dto.AtualizacaoUsuarioDTO;
import com.aqua.guard.monitoramento.api.v1.dto.DetalhamentoUsuarioDTO;
import com.aqua.guard.monitoramento.core.entity.Usuario;
import com.aqua.guard.monitoramento.core.service.UsuarioAS;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsuarioWS {

    @Autowired
    private UsuarioAS usuarioAS;

    @GetMapping("/me")
    public ResponseEntity<DetalhamentoUsuarioDTO> getMyProfile(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        var dadosUsuario = new DetalhamentoUsuarioDTO(usuarioAutenticado);
        return ResponseEntity.ok(dadosUsuario);
    }

    @PutMapping("/me")
    @Transactional
    public ResponseEntity<DetalhamentoUsuarioDTO> atualizarMinhaConta(
            @AuthenticationPrincipal Usuario usuarioAutenticado,
            @RequestBody @Valid AtualizacaoUsuarioDTO dados
    ) {
        var usuarioAtualizado = usuarioAS.atualizarInformacoes(usuarioAutenticado, dados);
        return ResponseEntity.ok(new DetalhamentoUsuarioDTO(usuarioAtualizado));
    }

    @DeleteMapping("/me")
    @Transactional
    public ResponseEntity<Void> excluirMinhaConta(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        usuarioAS.excluirConta(usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }

}