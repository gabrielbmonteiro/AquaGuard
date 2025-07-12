package com.aqua.guard.monitoramento.api.filter;

import com.aqua.guard.monitoramento.api.exception.InvalidTokenException;
import com.aqua.guard.monitoramento.core.service.TokenAS;
import com.aqua.guard.monitoramento.core.persistence.UsuarioEC;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class SecurityFilter extends OncePerRequestFilter {

    private final TokenAS tokenAS;

    private final UsuarioEC usuarioEC;

    private final AuthenticationEntryPoint authEntryPoint;

    public SecurityFilter(TokenAS tokenAS, UsuarioEC usuarioEC, @Qualifier("customAuthenticationEntryPoint") AuthenticationEntryPoint authEntryPoint) {
        this.tokenAS = tokenAS;
        this.usuarioEC = usuarioEC;
        this.authEntryPoint = authEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            var tokenJWT = recuperarToken(request);
            if (tokenJWT != null) {
                var subject = tokenAS.getSubject(tokenJWT);
                var usuario = usuarioEC.findByEmail(subject).orElse(null);
                if (usuario != null) {
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    SecurityContextHolder.clearContext();
                }
            }
            filterChain.doFilter(request, response);
        } catch (InvalidTokenException e) {
            authEntryPoint.commence(request, response, e);
        }
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}