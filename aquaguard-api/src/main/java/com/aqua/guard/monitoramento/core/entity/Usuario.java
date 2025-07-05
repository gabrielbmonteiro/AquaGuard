package com.aqua.guard.monitoramento.core.entity;

import com.aqua.guard.monitoramento.api.v1.dto.AtualizacaoPerfilDTO;
import com.aqua.guard.monitoramento.api.v1.dto.CadastroUsuarioDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Table(name = "usuarios")
@Entity(name = "Usuario")
@Getter
@NoArgsConstructor
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

    @Column(name = "pending_email")
    private String pendingEmail;

    @Column(name = "email_change_code")
    private String emailChangeCode;

    @Column(name = "email_change_code_expires_at")
    private LocalDateTime emailChangeCodeExpiresAt;

    @Column(name = "senha_hash", nullable = false)
    private String senha;

    private String telefone;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_code_expires_at")
    private LocalDateTime verificationCodeExpiresAt;

    private boolean ativo = false;

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
        this.caixasDAgua = new ArrayList<>();
    }

    public void atualizarDadosDeNovoRegistro(CadastroUsuarioDTO dados, String novaSenhaHasheada) {
        this.nomeCompleto = dados.nomeCompleto();
        this.telefone = dados.telefone();
        this.senha = novaSenhaHasheada;
        this.ativo = false;
    }

    public void atualizarPerfil(AtualizacaoPerfilDTO dados) {
        if (dados.nomeCompleto() != null && !dados.nomeCompleto().isBlank()) {
            this.nomeCompleto = dados.nomeCompleto();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
    }

    public void alterarSenha(String novaSenha) {
        this.senha = novaSenha;
    }

    public void ativarConta() {
        this.ativo = true;
        this.verificationCode = null;
        this.verificationCodeExpiresAt = null;
    }

    public void definirCodigoDeVerificacao(String codigo, LocalDateTime dataExpiracao) {
        this.verificationCode = codigo;
        this.verificationCodeExpiresAt = dataExpiracao;
    }

    public void definirCodigoDeMudancaDeEmail(String novoEmail, String codigo, LocalDateTime dataExpiracao) {
        this.pendingEmail = novoEmail;
        this.emailChangeCode = codigo;
        this.emailChangeCodeExpiresAt = dataExpiracao;
    }

    public void confirmarMudancaDeEmail() {
        if (this.pendingEmail != null) {
            this.email = this.pendingEmail;
        }
        this.pendingEmail = null;
        this.emailChangeCode = null;
        this.emailChangeCodeExpiresAt = null;
    }

}
