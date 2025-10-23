package com.fiscal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade Parcelamento - Representa parcelamentos fiscais
 * Padrão: Entity Pattern
 */
@Entity
@Table(name = "parcelamentos")
public class Parcelamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;

    @Column(name = "valor_total", precision = 15, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "numero_parcelas", nullable = false)
    private Integer numeroParcelas;

    @Column(name = "parcela_atual")
    private Integer parcelaAtual = 1;

    @Column(name = "valor_parcela", precision = 15, scale = 2)
    private BigDecimal valorParcela;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusParcelamento status = StatusParcelamento.ATIVO;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_recorrencia", nullable = false)
    private TipoRecorrencia tipoRecorrencia;

    @Column(name = "dia_vencimento")
    private Integer diaVencimento;

    @Column(name = "ajustar_finais_semana")
    private Boolean ajustarFinaisSemana = true;

    @Column(name = "ajustar_feriados")
    private Boolean ajustarFeriados = true;

    @Column(name = "observacoes", length = 1000)
    private String observacoes;

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

    public enum StatusParcelamento {
        ATIVO("Ativo"),
        CONCLUIDO("Concluído"),
        SUSPENSO("Suspenso"),
        CANCELADO("Cancelado");

        private final String descricao;

        StatusParcelamento(String descricao) {
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
        ANUAL("Anual");

        private final String descricao;

        TipoRecorrencia(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // Construtores
    public Parcelamento() {}

    public Parcelamento(Long id, String nome, String descricao, Cliente cliente, Responsavel responsavel,
                       BigDecimal valorTotal, Integer numeroParcelas, Integer parcelaAtual, BigDecimal valorParcela,
                       LocalDate dataInicio, LocalDate dataFim, StatusParcelamento status, TipoRecorrencia tipoRecorrencia,
                       Integer diaVencimento, Boolean ajustarFinaisSemana, Boolean ajustarFeriados,
                       String observacoes, Boolean ativo, LocalDateTime dataCriacao, LocalDateTime dataAtualizacao,
                       String ultimoEditor) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.cliente = cliente;
        this.responsavel = responsavel;
        this.valorTotal = valorTotal;
        this.numeroParcelas = numeroParcelas;
        this.parcelaAtual = parcelaAtual;
        this.valorParcela = valorParcela;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = status;
        this.tipoRecorrencia = tipoRecorrencia;
        this.diaVencimento = diaVencimento;
        this.ajustarFinaisSemana = ajustarFinaisSemana;
        this.ajustarFeriados = ajustarFeriados;
        this.observacoes = observacoes;
        this.ativo = ativo;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.ultimoEditor = ultimoEditor;
    }

    // Métodos de negócio
    public BigDecimal getValorRestante() {
        if (valorTotal == null || parcelaAtual == null || numeroParcelas == null) {
            return BigDecimal.ZERO;
        }
        int parcelasRestantes = numeroParcelas - parcelaAtual + 1;
        return valorParcela.multiply(BigDecimal.valueOf(parcelasRestantes));
    }

    public Double getProgressoPercentual() {
        if (numeroParcelas == null || parcelaAtual == null) {
            return 0.0;
        }
        return ((double) parcelaAtual / numeroParcelas) * 100;
    }

    public boolean isConcluido() {
        return StatusParcelamento.CONCLUIDO.equals(status) || 
               (parcelaAtual != null && numeroParcelas != null && parcelaAtual > numeroParcelas);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Responsavel getResponsavel() { return responsavel; }
    public void setResponsavel(Responsavel responsavel) { this.responsavel = responsavel; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public Integer getNumeroParcelas() { return numeroParcelas; }
    public void setNumeroParcelas(Integer numeroParcelas) { this.numeroParcelas = numeroParcelas; }

    public Integer getParcelaAtual() { return parcelaAtual; }
    public void setParcelaAtual(Integer parcelaAtual) { this.parcelaAtual = parcelaAtual; }

    public BigDecimal getValorParcela() { return valorParcela; }
    public void setValorParcela(BigDecimal valorParcela) { this.valorParcela = valorParcela; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public StatusParcelamento getStatus() { return status; }
    public void setStatus(StatusParcelamento status) { this.status = status; }

    public TipoRecorrencia getTipoRecorrencia() { return tipoRecorrencia; }
    public void setTipoRecorrencia(TipoRecorrencia tipoRecorrencia) { this.tipoRecorrencia = tipoRecorrencia; }

    public Integer getDiaVencimento() { return diaVencimento; }
    public void setDiaVencimento(Integer diaVencimento) { this.diaVencimento = diaVencimento; }

    public Boolean getAjustarFinaisSemana() { return ajustarFinaisSemana; }
    public void setAjustarFinaisSemana(Boolean ajustarFinaisSemana) { this.ajustarFinaisSemana = ajustarFinaisSemana; }

    public Boolean getAjustarFeriados() { return ajustarFeriados; }
    public void setAjustarFeriados(Boolean ajustarFeriados) { this.ajustarFeriados = ajustarFeriados; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

    public String getUltimoEditor() { return ultimoEditor; }
    public void setUltimoEditor(String ultimoEditor) { this.ultimoEditor = ultimoEditor; }
}
