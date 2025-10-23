package com.fiscal.service;

import com.fiscal.model.dto.NotificacaoTempoReal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Serviço para gerenciamento de notificações em tempo real
 * Padrão: Service Layer Pattern + Observer Pattern
 */
@Service
public class NotificacaoService {
    
    private static final Logger log = LoggerFactory.getLogger(NotificacaoService.class);
    
    private final WebSocketService webSocketService;
    
    public NotificacaoService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }
    
    /**
     * Notifica criação de obrigação
     */
    public void notificarCriacaoObrigacao(Long obrigacaoId, String nomeObrigacao, String usuarioEditor) {
        // Log removido temporariamente
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_CRIADA);
        notificacao.setMensagem(String.format("Nova obrigação criada: %s", nomeObrigacao));
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Notifica atualização de obrigação
     */
    public void notificarAtualizacaoObrigacao(Long obrigacaoId, String nomeObrigacao, String usuarioEditor) {
        // Log removido temporariamente
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_ATUALIZADA);
        notificacao.setMensagem(String.format("Obrigação atualizada: %s", nomeObrigacao));
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Notifica conclusão de obrigação
     */
    public void notificarConclusaoObrigacao(Long obrigacaoId, String nomeObrigacao, String usuarioEditor) {
        // Log removido temporariamente
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_CONCLUIDA);
        notificacao.setMensagem(String.format("Obrigação concluída: %s", nomeObrigacao));
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Notifica exclusão de obrigação
     */
    public void notificarExclusaoObrigacao(Long obrigacaoId, String nomeObrigacao, String usuarioEditor) {
        // Log removido temporariamente
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_EXCLUIDA);
        notificacao.setMensagem(String.format("Obrigação excluída: %s", nomeObrigacao));
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Notifica conflito de edição
     */
    public void notificarConflitoEdicao(Long obrigacaoId, String nomeObrigacao, String usuarioEditor, String usuarioConflito) {
        // Log removido temporariamente
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.CONFLITO_EDICAO);
        notificacao.setMensagem(String.format("Conflito de edição detectado em: %s. Usuários: %s e %s", 
                nomeObrigacao, usuarioEditor, usuarioConflito));
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Notifica alerta de vencimento próximo
     */
    public void notificarAlertaVencimento(Long obrigacaoId, String nomeObrigacao, int diasParaVencimento) {
        // Log removido temporariamente
        
        String mensagem = diasParaVencimento <= 0 
                ? String.format("ATENÇÃO: Obrigação VENCIDA - %s", nomeObrigacao)
                : String.format("ALERTA: Obrigação vence em %d dias - %s", diasParaVencimento, nomeObrigacao);
        
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_ATUALIZADA);
        notificacao.setMensagem(mensagem);
        notificacao.setObrigacaoId(obrigacaoId);
        notificacao.setUsuarioEditor("Sistema");
        notificacao.setTimestamp(LocalDateTime.now());
        
        webSocketService.notificarTodos(notificacao);
    }
    
    /**
     * Verifica se há usuários conectados para receber notificações
     */
    public boolean temUsuariosConectados() {
        return webSocketService.temUsuariosConectados();
    }
    
    /**
     * Obtém número de usuários conectados
     */
    public int getNumeroUsuariosConectados() {
        return webSocketService.getNumeroUsuariosConectados();
    }
}


