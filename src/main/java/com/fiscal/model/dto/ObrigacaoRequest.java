package com.fiscal.model.dto;

import com.fiscal.model.TipoObrigacao;
import com.fiscal.model.TipoRecorrencia;

import java.time.LocalDate;

/**
 * DTO para requisições de criação/atualização de obrigações
 */
public class ObrigacaoRequest {
    
    private String nome;
    private TipoObrigacao tipo;
    private String descricao;
    private Long clienteId;
    private Long responsavelId;
    private LocalDate dataVencimento;
    private TipoRecorrencia tipoRecorrencia;
    private Integer diasRecorrencia;
    private Integer diaMesRecorrencia;
    private Boolean ajustarFinaisSemana;
    private Boolean ajustarFeriados;
    private String usuarioEditor;
    
    // Construtores
    public ObrigacaoRequest() {}
    
    public ObrigacaoRequest(String nome, TipoObrigacao tipo, String descricao, Long clienteId, 
                           Long responsavelId, LocalDate dataVencimento, TipoRecorrencia tipoRecorrencia, 
                           Integer diasRecorrencia, Integer diaMesRecorrencia, Boolean ajustarFinaisSemana, 
                           Boolean ajustarFeriados, String usuarioEditor) {
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
        this.clienteId = clienteId;
        this.responsavelId = responsavelId;
        this.dataVencimento = dataVencimento;
        this.tipoRecorrencia = tipoRecorrencia;
        this.diasRecorrencia = diasRecorrencia;
        this.diaMesRecorrencia = diaMesRecorrencia;
        this.ajustarFinaisSemana = ajustarFinaisSemana;
        this.ajustarFeriados = ajustarFeriados;
        this.usuarioEditor = usuarioEditor;
    }
    
    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public TipoObrigacao getTipo() { return tipo; }
    public void setTipo(TipoObrigacao tipo) { this.tipo = tipo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    
    public Long getResponsavelId() { return responsavelId; }
    public void setResponsavelId(Long responsavelId) { this.responsavelId = responsavelId; }
    
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
    
    public String getUsuarioEditor() { return usuarioEditor; }
    public void setUsuarioEditor(String usuarioEditor) { this.usuarioEditor = usuarioEditor; }
}


