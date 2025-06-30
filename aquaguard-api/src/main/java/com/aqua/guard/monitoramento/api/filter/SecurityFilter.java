package com.aqua.guard.monitoramento.api.filter;

import com.aqua.guard.monitoramento.core.service.TokenService;
import com.aqua.guard.monitoramento.core.integration.persistence.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Recuperar o token do cabeçalho da requisição
        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            // 2. Validar o token e extrair o 'subject' (email do usuário)
            var subject = tokenService.getSubject(tokenJWT);

            // 3. Buscar o usuário no banco de dados com base no email extraído
            var usuario = usuarioRepository.findByEmail(subject).orElse(null);

            if (usuario != null) {
                // 4. Se o usuário existe, criamos um objeto de autenticação
                var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());

                // 5. Definimos este objeto no contexto do Spring Security.
                // A partir deste momento, o Spring considera o usuário como autenticado para esta requisição.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 6. Independentemente de ter autenticado ou não, continua o fluxo da requisição.
        // Se a autenticação não foi feita aqui, o Spring Security ainda pode barrar o acesso mais tarde.
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            // O token vem depois do prefixo "Bearer "
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}