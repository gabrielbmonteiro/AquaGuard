package com.aqua.guard.monitoramento.core.entity;

import com.aqua.guard.monitoramento.api.v1.dto.AtualizacaoUsuarioDTO;
import com.aqua.guard.monitoramento.api.v1.dto.CadastroUsuarioDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Table(name = "usuarios")
@Entity(name = "Usuario")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SQLDelete(sql = "UPDATE usuarios SET ativo = false WHERE id = ?")
@Where(clause = "ativo = true")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senha;

    private String telefone;

    private boolean ativo = true;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CaixaDAgua> caixasDAgua;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.ativo;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.ativo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.ativo;
    }

    @Override
    public boolean isEnabled() {
        return this.ativo;
    }

    public Usuario(CadastroUsuarioDTO dados, String senhaHasheada) {
        this.nomeCompleto = dados.nomeCompleto();
        this.email = dados.email();
        this.telefone = dados.telefone();
        this.senha = senhaHasheada;
        this.ativo = true;
        this.caixasDAgua = new ArrayList<>();
    }

    public void atualizarInformacoes(AtualizacaoUsuarioDTO dados, PasswordEncoder passwordEncoder) {
        if (dados.nomeCompleto() != null && !dados.nomeCompleto().isBlank()) {
            this.nomeCompleto = dados.nomeCompleto();
        }
        if (dados.email() != null && !dados.email().isBlank()) {
            this.email = dados.email();
        }
        if (dados.senha() != null && !dados.senha().isBlank()) {
            this.senha = passwordEncoder.encode(dados.senha());
        }
    }

}
