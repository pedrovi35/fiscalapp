package com.fiscal.controller;

import com.fiscal.service.ColaboracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * Controller WebSocket para colaboração em tempo real
 * Padrão: WebSocket Controller Pattern
 */
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final ColaboracaoService colaboracaoService;

    /**
     * Conecta um usuário ao sistema
     */
    @MessageMapping("/conectar")
    @SendToUser("/queue/conexao")
    public Map<String, Object> conectarUsuario(@Payload Map<String, String> dados, 
                                               SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String usuario = dados.get("usuario");
        String pagina = dados.get("pagina");
        
        colaboracaoService.registrarUsuario(sessionId, usuario, pagina);
        
        return Map.of(
            "status", "conectado",
            "sessionId", sessionId,
            "usuariosConectados", colaboracaoService.getUsuariosConectados().size()
        );
    }

    /**
     * Desconecta um usuário
     */
    @MessageMapping("/desconectar")
    public void desconectarUsuario(SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        colaboracaoService.removerUsuario(sessionId);
    }

    /**
     * Atualiza página do usuário
     */
    @MessageMapping("/atualizar-pagina")
    public void atualizarPagina(@Payload Map<String, String> dados,
                               SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String novaPagina = dados.get("pagina");
        colaboracaoService.atualizarPaginaUsuario(sessionId, novaPagina);
    }

    /**
     * Notifica início de edição
     */
    @MessageMapping("/iniciar-edicao")
    public void iniciarEdicao(@Payload Map<String, Object> dados,
                             SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String entidade = (String) dados.get("entidade");
        Long id = Long.valueOf(dados.get("id").toString());
        String usuario = (String) dados.get("usuario");
        
        colaboracaoService.notificarConflitoEdicao(entidade, id, usuario);
    }

    /**
     * Notifica fim de edição
     */
    @MessageMapping("/finalizar-edicao")
    public void finalizarEdicao(@Payload Map<String, Object> dados) {
        String entidade = (String) dados.get("entidade");
        Long id = Long.valueOf(dados.get("id").toString());
        String usuario = (String) dados.get("usuario");
        
        colaboracaoService.notificarMudanca("OBRIGACAO_ATUALIZADA", 
            usuario + " finalizou a edição de " + entidade + " #" + id,
            Map.of("entidade", entidade, "id", id),
            usuario);
    }
}
