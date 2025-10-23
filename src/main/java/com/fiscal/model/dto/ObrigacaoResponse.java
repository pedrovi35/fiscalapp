package com.fiscal.model.dto;

import com.fiscal.model.Cliente;
import com.fiscal.model.Responsavel;
import com.fiscal.model.TipoObrigacao;
import com.fiscal.model.TipoRecorrencia;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para resposta de obrigações com informações completas
 */
public class ObrigacaoResponse {
    
    private Long id;
    private String nome;
    private TipoObrigacao tipo;
    private String descricao;
    private Cliente cliente;
    private Responsavel responsavel;
    private LocalDate dataVencimento;
    private TipoRecorrencia tipoRecorrencia;
    private Integer diasRecorrencia;
    private Integer diaMesRecorrencia;
    private Boolean ajustarFinaisSemana;
    private Boolean ajustarFeriados;
    private LocalDate dataProximaGeracao;
    private Boolean ativo;
    private Boolean concluida;
    private LocalDate dataConclusao;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private String ultimoEditor;
    private Long diasParaVencimento;
    private String statusUrgencia;
    
    // Construtores
    public ObrigacaoResponse() {}
    
    public ObrigacaoResponse(Long id, String nome, TipoObrigacao tipo, String descricao, 
                           Cliente cliente, Responsavel responsavel, LocalDate dataVencimento, 
                           TipoRecorrencia tipoRecorrencia, Integer diasRecorrencia, 
                           Integer diaMesRecorrencia, Boolean ajustarFinaisSemana, 
                           Boolean ajustarFeriados, LocalDate dataProximaGeracao, Boolean ativo, 
                           Boolean concluida, LocalDate dataConclusao, LocalDateTime dataCriacao, 
                           LocalDateTime dataAtualizacao, String ultimoEditor, 
                           Long diasParaVencimento, String statusUrgencia) {
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
        this.diasParaVencimento = diasParaVencimento;
        this.statusUrgencia = statusUrgencia;
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
    
    public Long getDiasParaVencimento() { return diasParaVencimento; }
    public void setDiasParaVencimento(Long diasParaVencimento) { this.diasParaVencimento = diasParaVencimento; }
    
    public String getStatusUrgencia() { return statusUrgencia; }
    public void setStatusUrgencia(String statusUrgencia) { this.statusUrgencia = statusUrgencia; }
}


