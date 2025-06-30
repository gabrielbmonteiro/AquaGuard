package com.aqua.guard.monitoramento.api.filter;

import com.aqua.guard.monitoramento.core.integration.persistence.CaixaDAguaRepository;
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
public class ApiKeyFilter extends OncePerRequestFilter {

    @Autowired
    private CaixaDAguaRepository caixaDAguaRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var apiKey = request.getHeader("X-API-Key");

        if (apiKey != null) {
            var caixaOptional = caixaDAguaRepository.findByChaveApi(apiKey);
            if (caixaOptional.isPresent()) {
                var caixa = caixaOptional.get();
                // Usamos o próprio objeto CaixaDAgua como principal
                var authentication = new UsernamePasswordAuthenticationToken(caixa, null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}