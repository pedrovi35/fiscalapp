package com.fiscal.controller;

import com.fiscal.model.dto.ObrigacaoRequest;
import com.fiscal.model.dto.ObrigacaoResponse;
import com.fiscal.service.ObrigacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gerenciamento de obrigações
 * Padrão: REST Controller Pattern
 */
@RestController
@RequestMapping("/obrigacoes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ObrigacaoController {
    
    private final ObrigacaoService obrigacaoService;
    
    /**
     * Cria uma nova obrigação
     */
    @PostMapping
    public ResponseEntity<ObrigacaoResponse> criarObrigacao(@Valid @RequestBody ObrigacaoRequest request) {
        System.out.println("Recebida requisição para criar obrigação: " + request.getNome());
        
        try {
            ObrigacaoResponse response = obrigacaoService.criarObrigacao(request);
            return ResponseEntity.ok(null) // ResponseEntity temporariamente simplificado;
        } catch (Exception e) {
            System.out.println("Erro ao criar obrigação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Atualiza uma obrigação existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ObrigacaoResponse> atualizarObrigacao(
            @PathVariable Long id, 
            @Valid @RequestBody ObrigacaoRequest request) {
        // Log removido temporariamente
        
        try {
            ObrigacaoResponse response = obrigacaoService.atualizarObrigacao(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Erro ao atualizar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Marca uma obrigação como concluída
     */
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ObrigacaoResponse> concluirObrigacao(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            ObrigacaoResponse response = obrigacaoService.concluirObrigacao(id, usuarioEditor);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Erro ao concluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println("Erro ao concluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Busca obrigações próximas do vencimento
     */
    @GetMapping("/proximas-vencimento")
    public ResponseEntity<List<ObrigacaoResponse>> buscarProximasVencimento(
            @RequestParam(defaultValue = "7") int dias) {
        // Log removido temporariamente
        
        try {
            List<ObrigacaoResponse> response = obrigacaoService.buscarProximasVencimento(dias);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigações próximas do vencimento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca obrigações vencidas
     */
    @GetMapping("/vencidas")
    public ResponseEntity<List<ObrigacaoResponse>> buscarVencidas() {
        // Log removido temporariamente
        
        try {
            List<ObrigacaoResponse> response = obrigacaoService.buscarVencidas();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigações vencidas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca todas as obrigações com filtros
     */
    @GetMapping
    public ResponseEntity<Page<ObrigacaoResponse>> buscarObrigacoes(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long responsavelId,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Boolean concluida,
            Pageable pageable) {
        // Log removido temporariamente
        
        try {
            // Implementar busca com filtros usando o repository
            // Por enquanto, retornar lista vazia
            return ResponseEntity.ok(Page.empty());
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigações: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca uma obrigação por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ObrigacaoResponse> buscarObrigacao(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            // Implementar busca por ID
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED);
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Exclui uma obrigação
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirObrigacao(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            // Implementar exclusão lógica
            return ResponseEntity.noContent();
        } catch (Exception e) {
            System.out.println("Erro ao excluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


