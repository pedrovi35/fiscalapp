package com.fiscal.service;

import com.fiscal.model.dto.NotificacaoTempoReal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Serviço WebSocket para colaboração em tempo real
 * Padrão: Service Layer Pattern + Observer Pattern
 */
@Service
@Slf4j
public class WebSocketService implements WebSocketHandler {
    
    private final Map<String, WebSocketSession> sessoes = new ConcurrentHashMap<>();
    private final Map<String, String> usuariosConectados = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = session.getId();
        sessoes.put(sessionId, session);
        
        // Log removido temporariamente
        
        // Notificar outros usuários sobre nova conexão
        notificarUsuarios(NotificacaoTempoRealnew 
                .tipo(NotificacaoTempoReal.TipoNotificacao.USUARIO_CONECTADO)
                .mensagem("Usuário conectado")
                .timestamp(java.time.LocalDateTime.now())
                , sessionId);
    }
    
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String sessionId = session.getId();
        String payload = message.getPayload().toString();
        
        // Log removido temporariamente
        
        // Processar mensagem recebida
        processarMensagem(sessionId, payload);
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        String sessionId = session.getId();
        System.out.println("Erro de transporte WebSocket para sessão {}: " + sessionId, exception.getMessage());
        
        // Remover sessão em caso de erro
        removerSessao(sessionId);
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        String sessionId = session.getId();
        // Log removido temporariamente
        
        // Notificar outros usuários sobre desconexão
        notificarUsuarios(NotificacaoTempoRealnew 
                .tipo(NotificacaoTempoReal.TipoNotificacao.USUARIO_DESCONECTADO)
                .mensagem("Usuário desconectado")
                .timestamp(java.time.LocalDateTime.now())
                , sessionId);
        
        removerSessao(sessionId);
    }
    
    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
    
    /**
     * Envia notificação para todos os usuários conectados
     */
    public void notificarTodos(NotificacaoTempoReal notificacao) {
        System.out.println("Enviando notificação para todos os usuários: " + notificacao.getTipo());
        
        sessoes.values().forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(converterParaJson(notificacao)));
                }
            } catch (IOException e) {
                System.out.println("Erro ao enviar notificação para sessão {}: " + session.getId(), e.getMessage());
            }
        });
    }
    
    /**
     * Envia notificação para todos os usuários exceto o remetente
     */
    public void notificarUsuarios(NotificacaoTempoReal notificacao, String sessionIdRemetente) {
        System.out.println("Enviando notificação para usuários (exceto {}): " + sessionIdRemetente, notificacao.getTipo());
        
        sessoes.entrySet().stream()
                .filter(entry -> !entry.getKey().equals(sessionIdRemetente))
                .forEach(entry -> {
                    try {
                        WebSocketSession session = entry.getValue();
                        if (session.isOpen()) {
                            session.sendMessage(new TextMessage(converterParaJson(notificacao)));
                        }
                    } catch (IOException e) {
                        System.out.println("Erro ao enviar notificação para sessão {}: " + entry.getKey(), e.getMessage());
                    }
                });
    }
    
    /**
     * Envia notificação para um usuário específico
     */
    public void notificarUsuario(String usuarioId, NotificacaoTempoReal notificacao) {
        System.out.println("Enviando notificação para usuário {}: " + usuarioId, notificacao.getTipo());
        
        usuariosConectados.entrySet().stream()
                .filter(entry -> entry.getValue().equals(usuarioId))
                .forEach(entry -> {
                    String sessionId = entry.getKey();
                    WebSocketSession session = sessoes.get(sessionId);
                    if (session != null && session.isOpen()) {
                        try {
                            session.sendMessage(new TextMessage(converterParaJson(notificacao)));
                        } catch (IOException e) {
                            System.out.println("Erro ao enviar notificação para usuário {}: " + usuarioId, e.getMessage());
                        }
                    }
                });
    }
    
    /**
     * Processa mensagem recebida do cliente
     */
    private void processarMensagem(String sessionId, String payload) {
        try {
            // Aqui você pode implementar lógica para processar diferentes tipos de mensagem
            // Por exemplo, identificar usuário, processar comandos, etc.
            // Log removido temporariamente
            
        } catch (Exception e) {
            System.out.println("Erro ao processar mensagem da sessão {}: " + sessionId, e.getMessage());
        }
    }
    
    /**
     * Remove sessão e limpa dados relacionados
     */
    private void removerSessao(String sessionId) {
        sessoes.remove(sessionId);
        usuariosConectados.remove(sessionId);
    }
    
    /**
     * Converte notificação para JSON
     */
    private String converterParaJson(NotificacaoTempoReal notificacao) {
        // Implementação simples - em produção usar Jackson ou Gson
        return String.format(
                "{\"tipo\":\"%s\",\"mensagem\":\"%s\",\"timestamp\":\"%s\",\"obrigacaoId\":%s,\"usuarioEditor\":\"%s\"}",
                notificacao.getTipo(),
                notificacao.getMensagem(),
                notificacao.getTimestamp(),
                notificacao.getObrigacaoId() != null ? notificacao.getObrigacaoId() : "null",
                notificacao.getUsuarioEditor() != null ? notificacao.getUsuarioEditor() : ""
        );
    }
    
    /**
     * Obtém número de usuários conectados
     */
    public int getNumeroUsuariosConectados() {
        return sessoes.size();
    }
    
    /**
     * Verifica se há usuários conectados
     */
    public boolean temUsuariosConectados() {
        return !sessoes.isEmpty();
    }
}


