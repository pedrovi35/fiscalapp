package com.fiscal.model.dto;

import java.time.LocalDateTime;

/**
 * DTO para comunicação WebSocket - Notificações em tempo real
 * Padrão: DTO Pattern
 */
public class NotificacaoTempoReal {
    
    private TipoNotificacao tipo;
    private String mensagem;
    private Long obrigacaoId;
    private String usuarioEditor;
    private LocalDateTime timestamp;
    private Object dados;
    
    public enum TipoNotificacao {
        OBRIGACAO_CRIADA,
        OBRIGACAO_ATUALIZADA,
        OBRIGACAO_CONCLUIDA,
        OBRIGACAO_EXCLUIDA,
        CONFLITO_EDICAO,
        USUARIO_CONECTADO,
        USUARIO_DESCONECTADO
    }
    
    // Construtores
    public NotificacaoTempoReal() {}
    
    public NotificacaoTempoReal(TipoNotificacao tipo, String mensagem, Long obrigacaoId, 
                               String usuarioEditor, LocalDateTime timestamp, Object dados) {
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.obrigacaoId = obrigacaoId;
        this.usuarioEditor = usuarioEditor;
        this.timestamp = timestamp;
        this.dados = dados;
    }
    
    // Getters e Setters
    public TipoNotificacao getTipo() { return tipo; }
    public void setTipo(TipoNotificacao tipo) { this.tipo = tipo; }
    
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    
    public Long getObrigacaoId() { return obrigacaoId; }
    public void setObrigacaoId(Long obrigacaoId) { this.obrigacaoId = obrigacaoId; }
    
    public String getUsuarioEditor() { return usuarioEditor; }
    public void setUsuarioEditor(String usuarioEditor) { this.usuarioEditor = usuarioEditor; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public Object getDados() { return dados; }
    public void setDados(Object dados) { this.dados = dados; }
}


