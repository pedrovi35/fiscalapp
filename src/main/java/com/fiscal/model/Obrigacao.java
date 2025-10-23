package com.fiscal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade Obrigacao - Representa obrigações fiscais
 * Padrão: Entity Pattern
 */
@Entity
@Table(name = "obrigacoes")
public class Obrigacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String nome;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoObrigacao tipo;
    
    @Column(length = 500)
    private String descricao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;
    
    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_recorrencia", nullable = false)
    private TipoRecorrencia tipoRecorrencia;
    
    @Column(name = "dias_recorrencia")
    private Integer diasRecorrencia;
    
    @Column(name = "dia_mes_recorrencia")
    private Integer diaMesRecorrencia;
    
    @Column(name = "ajustar_finais_semana")
    private Boolean ajustarFinaisSemana = true;
    
    @Column(name = "ajustar_feriados")
    private Boolean ajustarFeriados = true;
    
    @Column(name = "data_proxima_geracao")
    private LocalDate dataProximaGeracao;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "concluida")
    private Boolean concluida = false;
    
    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;
    
    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
    @Column(name = "ultimo_editor")
    private String ultimoEditor;
    
    // Construtores
    public Obrigacao() {}
    
    public Obrigacao(Long id, String nome, TipoObrigacao tipo, String descricao, Cliente cliente, 
                    Responsavel responsavel, LocalDate dataVencimento, TipoRecorrencia tipoRecorrencia, 
                    Integer diasRecorrencia, Integer diaMesRecorrencia, Boolean ajustarFinaisSemana, 
                    Boolean ajustarFeriados, LocalDate dataProximaGeracao, Boolean ativo, 
                    Boolean concluida, LocalDate dataConclusao, LocalDateTime dataCriacao, 
                    LocalDateTime dataAtualizacao, String ultimoEditor) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
        this.cliente = cliente;
        this.responsavel = responsavel;
        this.dataVencimento = dataVencimento;
        this.tipoRecorrencia = tipoRecorrencia;
        this.diasRecorrencia = diasRecorrencia;
        this.diaMesRecorrencia = diaMesRecorrencia;
        this.ajustarFinaisSemana = ajustarFinaisSemana;
        this.ajustarFeriados = ajustarFeriados;
        this.dataProximaGeracao = dataProximaGeracao;
        this.ativo = ativo;
        this.concluida = concluida;
        this.dataConclusao = dataConclusao;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.ultimoEditor = ultimoEditor;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public TipoObrigacao getTipo() { return tipo; }
    public void setTipo(TipoObrigacao tipo) { this.tipo = tipo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public Responsavel getResponsavel() { return responsavel; }
    public void setResponsavel(Responsavel responsavel) { this.responsavel = responsavel; }
    
    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }
    
    public TipoRecorrencia getTipoRecorrencia() { return tipoRecorrencia; }
    public void setTipoRecorrencia(TipoRecorrencia tipoRecorrencia) { this.tipoRecorrencia = tipoRecorrencia; }
    
    public Integer getDiasRecorrencia() { return diasRecorrencia; }
    public void setDiasRecorrencia(Integer diasRecorrencia) { this.diasRecorrencia = diasRecorrencia; }
    
    public Integer getDiaMesRecorrencia() { return diaMesRecorrencia; }
    public void setDiaMesRecorrencia(Integer diaMesRecorrencia) { this.diaMesRecorrencia = diaMesRecorrencia; }
    
    public Boolean getAjustarFinaisSemana() { return ajustarFinaisSemana; }
    public void setAjustarFinaisSemana(Boolean ajustarFinaisSemana) { this.ajustarFinaisSemana = ajustarFinaisSemana; }
    
    public Boolean getAjustarFeriados() { return ajustarFeriados; }
    public void setAjustarFeriados(Boolean ajustarFeriados) { this.ajustarFeriados = ajustarFeriados; }
    
    public LocalDate getDataProximaGeracao() { return dataProximaGeracao; }
    public void setDataProximaGeracao(LocalDate dataProximaGeracao) { this.dataProximaGeracao = dataProximaGeracao; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public Boolean getConcluida() { return concluida; }
    public void setConcluida(Boolean concluida) { this.concluida = concluida; }
    
    public LocalDate getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(LocalDate dataConclusao) { this.dataConclusao = dataConclusao; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public String getUltimoEditor() { return ultimoEditor; }
    public void setUltimoEditor(String ultimoEditor) { this.ultimoEditor = ultimoEditor; }
}


