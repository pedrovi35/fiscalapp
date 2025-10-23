package com.fiscal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade Imposto - Representa impostos e tributos fiscais
 * Padrão: Entity Pattern
 */
@Entity
@Table(name = "impostos")
public class Imposto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(length = 10)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoImposto tipo;

    @Column(length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_recorrencia", nullable = false)
    private TipoRecorrencia tipoRecorrencia;

    @Column(name = "dia_vencimento")
    private Integer diaVencimento;

    @Column(name = "mes_vencimento")
    private Integer mesVencimento;

    @Column(name = "ajustar_finais_semana")
    private Boolean ajustarFinaisSemana = true;

    @Column(name = "ajustar_feriados")
    private Boolean ajustarFeriados = true;

    @Column(name = "prazo_antecedencia_dias")
    private Integer prazoAntecedenciaDias = 7;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "ultimo_editor")
    private String ultimoEditor;

    public enum TipoImposto {
        FEDERAL("Federal"),
        ESTADUAL("Estadual"),
        MUNICIPAL("Municipal"),
        CONTRIBUIÇÃO("Contribuição"),
        TAXA("Taxa"),
        OUTROS("Outros");

        private final String descricao;

        TipoImposto(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum TipoRecorrencia {
        MENSAL("Mensal"),
        BIMESTRAL("Bimestral"),
        TRIMESTRAL("Trimestral"),
        SEMESTRAL("Semestral"),
        ANUAL("Anual"),
        PERSONALIZADA("Personalizada");

        private final String descricao;

        TipoRecorrencia(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // Construtores
    public Imposto() {}

    public Imposto(Long id, String nome, String codigo, TipoImposto tipo, String descricao,
                   TipoRecorrencia tipoRecorrencia, Integer diaVencimento, Integer mesVencimento,
                   Boolean ajustarFinaisSemana, Boolean ajustarFeriados, Integer prazoAntecedenciaDias,
                   Boolean ativo, LocalDateTime dataCriacao, LocalDateTime dataAtualizacao, String ultimoEditor) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.tipo = tipo;
        this.descricao = descricao;
        this.tipoRecorrencia = tipoRecorrencia;
        this.diaVencimento = diaVencimento;
        this.mesVencimento = mesVencimento;
        this.ajustarFinaisSemana = ajustarFinaisSemana;
        this.ajustarFeriados = ajustarFeriados;
        this.prazoAntecedenciaDias = prazoAntecedenciaDias;
        this.ativo = ativo;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.ultimoEditor = ultimoEditor;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public TipoImposto getTipo() { return tipo; }
    public void setTipo(TipoImposto tipo) { this.tipo = tipo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public TipoRecorrencia getTipoRecorrencia() { return tipoRecorrencia; }
    public void setTipoRecorrencia(TipoRecorrencia tipoRecorrencia) { this.tipoRecorrencia = tipoRecorrencia; }

    public Integer getDiaVencimento() { return diaVencimento; }
    public void setDiaVencimento(Integer diaVencimento) { this.diaVencimento = diaVencimento; }

    public Integer getMesVencimento() { return mesVencimento; }
    public void setMesVencimento(Integer mesVencimento) { this.mesVencimento = mesVencimento; }

    public Boolean getAjustarFinaisSemana() { return ajustarFinaisSemana; }
    public void setAjustarFinaisSemana(Boolean ajustarFinaisSemana) { this.ajustarFinaisSemana = ajustarFinaisSemana; }

    public Boolean getAjustarFeriados() { return ajustarFeriados; }
    public void setAjustarFeriados(Boolean ajustarFeriados) { this.ajustarFeriados = ajustarFeriados; }

    public Integer getPrazoAntecedenciaDias() { return prazoAntecedenciaDias; }
    public void setPrazoAntecedenciaDias(Integer prazoAntecedenciaDias) { this.prazoAntecedenciaDias = prazoAntecedenciaDias; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

    public String getUltimoEditor() { return ultimoEditor; }
    public void setUltimoEditor(String ultimoEditor) { this.ultimoEditor = ultimoEditor; }
}
