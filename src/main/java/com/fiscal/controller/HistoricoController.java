package com.fiscal.controller;

import com.fiscal.model.HistoricoAlteracao;
import com.fiscal.service.HistoricoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para histórico de alterações
 * Padrão: REST Controller Pattern
 */
@RestController
@RequestMapping("/historico")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HistoricoController {
    
    private final HistoricoService historicoService;
    
    /**
     * Busca histórico de uma obrigação
     */
    @GetMapping("/obrigacao/{obrigacaoId}")
    public ResponseEntity<List<HistoricoAlteracao>> buscarHistoricoObrigacao(@PathVariable Long obrigacaoId) {
        // Log removido temporariamente
        
        try {
            List<HistoricoAlteracao> historico = historicoService.buscarHistoricoObrigacao(obrigacaoId);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.out.println("Erro ao buscar histórico da obrigação ID " + obrigacaoId + ": " + e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Busca últimas alterações do sistema
     */
    @GetMapping("/ultimas")
    public ResponseEntity<List<HistoricoAlteracao>> buscarUltimasAlteracoes(
            @RequestParam(defaultValue = "10") int limite) {
        // Log removido temporariamente
        
        try {
            List<HistoricoAlteracao> historico = historicoService.buscarUltimasAlteracoes(limite);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.out.println("Erro ao buscar últimas alterações: " + e.getMessage());
            return ResponseEntity.status(500);
        }
    }
}


