package com.fiscal.model;

/**
 * Enum para tipos de obrigação
 */
public enum TipoObrigacao {
    IMPOSTO("Imposto", "#28a745"),
    PARCELAMENTO("Parcelamento", "#ffc107"),
    DECLARACAO("Declaração", "#17a2b8"),
    DOCUMENTO("Documento", "#6f42c1"),
    OUTROS("Outros", "#6c757d");
    
    private final String descricao;
    private final String cor;
    
    TipoObrigacao(String descricao, String cor) {
        this.descricao = descricao;
        this.cor = cor;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public String getCor() {
        return cor;
    }
}


