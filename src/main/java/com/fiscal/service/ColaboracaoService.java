package com.fiscal.service;

import com.fiscal.model.dto.NotificacaoTempoReal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Serviço para colaboração em tempo real
 * Padrão: Service Layer Pattern + Observer Pattern
 */
@Service
@RequiredArgsConstructor
public class ColaboracaoService {

    private final SimpMessagingTemplate messagingTemplate;
    
    // Mapa para rastrear usuários conectados
    private final Map<String, UsuarioConectado> usuariosConectados = new ConcurrentHashMap<>();
    
    /**
     * Notifica todos os usuários conectados sobre uma mudança
     */
    public void notificarMudanca(String tipo, String mensagem, Object dados, String usuarioEditor) {
        NotificacaoTempoReal notificacao = new NotificacaoTempoReal();
        notificacao.setTipo(NotificacaoTempoReal.TipoNotificacao.valueOf(tipo));
        notificacao.setMensagem(mensagem);
        notificacao.setUsuarioEditor(usuarioEditor);
        notificacao.setTimestamp(LocalDateTime.now());
        notificacao.setDados(dados);
        
        messagingTemplate.convertAndSend("/topic/colaboracao", notificacao);
    }
    
    /**
     * Registra um usuário como conectado
     */
    public void registrarUsuario(String sessionId, String usuario, String paginaAtual) {
        UsuarioConectado usuarioConectado = new UsuarioConectado();
        usuarioConectado.setSessionId(sessionId);
        usuarioConectado.setUsuario(usuario);
        usuarioConectado.setPaginaAtual(paginaAtual);
        usuarioConectado.setUltimaAtividade(LocalDateTime.now());
        
        usuariosConectados.put(sessionId, usuarioConectado);
        
        // Notifica outros usuários sobre a nova conexão
        notificarMudanca("USUARIO_CONECTADO", usuario + " conectou-se", 
                        Map.of("usuario", usuario, "pagina", paginaAtual), "Sistema");
    }
    
    /**
     * Remove um usuário quando desconecta
     */
    public void removerUsuario(String sessionId) {
        UsuarioConectado usuario = usuariosConectados.remove(sessionId);
        if (usuario != null) {
            notificarMudanca("USUARIO_DESCONECTADO", usuario.getUsuario() + " desconectou-se", 
                            Map.of("usuario", usuario.getUsuario()), "Sistema");
        }
    }
    
    /**
     * Atualiza a página atual do usuário
     */
    public void atualizarPaginaUsuario(String sessionId, String novaPagina) {
        UsuarioConectado usuario = usuariosConectados.get(sessionId);
        if (usuario != null) {
            usuario.setPaginaAtual(novaPagina);
            usuario.setUltimaAtividade(LocalDateTime.now());
        }
    }
    
    /**
     * Notifica sobre edição simultânea
     */
    public void notificarConflitoEdicao(String entidade, Long id, String usuarioEditor) {
        notificarMudanca("CONFLITO_EDICAO", 
                        "Atenção: " + usuarioEditor + " está editando " + entidade + " #" + id,
                        Map.of("entidade", entidade, "id", id, "editor", usuarioEditor),
                        "Sistema");
    }
    
    /**
     * Obtém lista de usuários conectados
     */
    public Map<String, UsuarioConectado> getUsuariosConectados() {
        return usuariosConectados;
    }
    
    /**
     * Classe interna para representar usuário conectado
     */
    public static class UsuarioConectado {
        private String sessionId;
        private String usuario;
        private String paginaAtual;
        private LocalDateTime ultimaAtividade;
        
        // Getters e Setters
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }
        
        public String getUsuario() { return usuario; }
        public void setUsuario(String usuario) { this.usuario = usuario; }
        
        public String getPaginaAtual() { return paginaAtual; }
        public void setPaginaAtual(String paginaAtual) { this.paginaAtual = paginaAtual; }
        
        public LocalDateTime getUltimaAtividade() { return ultimaAtividade; }
        public void setUltimaAtividade(LocalDateTime ultimaAtividade) { this.ultimaAtividade = ultimaAtividade; }
    }
}
