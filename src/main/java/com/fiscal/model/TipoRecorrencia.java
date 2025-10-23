package com.fiscal.model;

/**
 * Enum para tipos de recorrência
 * Padrão: Enum Pattern
 */
public enum TipoRecorrencia {
    UNICA("Única"),
    MENSAL("Mensal"),
    TRIMESTRAL("Trimestral"),
    SEMESTRAL("Semestral"),
    ANUAL("Anual"),
    CUSTOMIZADA("Customizada");
    
    private final String descricao;
    
    TipoRecorrencia(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
}


