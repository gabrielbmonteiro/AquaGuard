package com.aqua.guard.monitoramento.core.entity;

import com.aqua.guard.monitoramento.api.v1.dto.DadosAtualizacaoCaixaDAgua;
import com.aqua.guard.monitoramento.api.v1.dto.DadosCadastroCaixaDAgua;
import com.aqua.guard.monitoramento.api.v1.dto.DadosPareamentoDispositivo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Table(name = "caixas_dagua")
@Entity(name = "CaixaDAgua")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@SQLDelete(sql = "UPDATE caixas_dagua SET ativo = false WHERE id = ?")
@Where(clause = "ativo = true")
public class CaixaDAgua {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nome_dispositivo", nullable = false, unique = true)
    private String nomeDispositivo;

    @Column(name = "serial_number", nullable = false, unique = true)
    private String serialNumber;

    @Column(name = "chave_api", nullable = false, unique = true)
    private String chaveApi;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2) // 10 dígitos no total, 2 depois da vírgula
    private BigDecimal capacidade;

    @Column(name = "meta_diaria", precision = 10, scale = 2)
    private BigDecimal metaDiaria;

    @Column(name = "meta_semanal", precision = 10, scale = 2)
    private BigDecimal metaSemanal;

    @Column(name = "meta_mensal", precision = 10, scale = 2)
    private BigDecimal metaMensal;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    private boolean ativo = true;

    @OneToMany(mappedBy = "caixaDAgua", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeituraVolume> leituras;

    public CaixaDAgua(DadosPareamentoDispositivo dados, Usuario usuario) {
        this.usuario = usuario;
        this.serialNumber = dados.serialNumberDispositivo();
        this.nome = dados.nomeCaixa();
        this.capacidade = dados.capacidade();
        this.chaveApi = UUID.randomUUID().toString().replace("-", "") +
                UUID.randomUUID().toString().replace("-", "");
        this.metaDiaria = null;
        this.metaSemanal = null;
        this.metaMensal = null;
        this.ativo = true;
    }

    public void atualizarInformacoes(DadosAtualizacaoCaixaDAgua dados) {
        if (dados.nome() != null && !dados.nome().isBlank()) {
            this.nome = dados.nome();
        }
        if (dados.capacidade() != null) {
            this.capacidade = dados.capacidade();
        }
        if (dados.metaDiaria() != null) {
            this.metaDiaria = dados.metaDiaria();
        }
        if (dados.metaSemanal() != null) {
            this.metaSemanal = dados.metaSemanal();
        }
        if (dados.metaMensal() != null) {
            this.metaMensal = dados.metaMensal();
        }
    }

}
