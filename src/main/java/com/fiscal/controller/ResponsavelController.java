package com.fiscal.controller;

import com.fiscal.model.Responsavel;
import com.fiscal.repository.ResponsavelRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para gerenciamento de responsáveis
 * Padrão: REST Controller Pattern
 */
@RestController
@RequestMapping("/responsaveis")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ResponsavelController {
    
    private final ResponsavelRepository responsavelRepository;
    
    /**
     * Cria um novo responsável
     */
    @PostMapping
    public ResponseEntity<Responsavel> criarResponsavel(@Valid @RequestBody Responsavel responsavel) {
        System.out.println("Recebida requisição para criar responsável: " + responsavel.getNome());
        
        try {
            Responsavel responsavelSalvo = responsavelRepository.save(responsavel);
            return ResponseEntity.ok(null) // ResponseEntity temporariamente simplificado;
        } catch (Exception e) {
            System.out.println("Erro ao criar responsável: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Atualiza um responsável existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Responsavel> atualizarResponsavel(
            @PathVariable Long id, 
            @Valid @RequestBody Responsavel responsavel) {
        // Log removido temporariamente
        
        try {
            Optional<Responsavel> responsavelExistente = responsavelRepository.findById(id);
            if (responsavelExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND);
            }
            
            responsavel.setId(id);
            Responsavel responsavelSalvo = responsavelRepository.save(responsavel);
            return ResponseEntity.ok(responsavelSalvo);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar responsável ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Busca todos os responsáveis
     */
    @GetMapping
    public ResponseEntity<List<Responsavel>> buscarResponsaveis() {
        // Log removido temporariamente
        
        try {
            List<Responsavel> responsaveis = responsavelRepository.findByAtivoTrueOrderByNomeAsc();
            return ResponseEntity.ok(responsaveis);
        } catch (Exception e) {
            System.out.println("Erro ao buscar responsáveis: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca responsáveis por nome
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Responsavel>> buscarResponsaveisPorNome(@RequestParam String nome) {
        // Log removido temporariamente
        
        try {
            List<Responsavel> responsaveis = responsavelRepository.findByNomeContainingIgnoreCase(nome);
            return ResponseEntity.ok(responsaveis);
        } catch (Exception e) {
            System.out.println("Erro ao buscar responsáveis por nome: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca responsáveis por cargo
     */
    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<Responsavel>> buscarResponsaveisPorCargo(@PathVariable String cargo) {
        // Log removido temporariamente
        
        try {
            List<Responsavel> responsaveis = responsavelRepository.findByCargoContainingIgnoreCase(cargo);
            return ResponseEntity.ok(responsaveis);
        } catch (Exception e) {
            System.out.println("Erro ao buscar responsáveis por cargo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca um responsável por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Responsavel> buscarResponsavel(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            Optional<Responsavel> responsavel = responsavelRepository.findById(id);
            return responsavel.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.out.println("Erro ao buscar responsável ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca responsável por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Responsavel> buscarResponsavelPorEmail(@PathVariable String email) {
        // Log removido temporariamente
        
        try {
            Optional<Responsavel> responsavel = responsavelRepository.findByEmailAndAtivoTrue(email);
            return responsavel.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.out.println("Erro ao buscar responsável por email {}: " + email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Desativa um responsável (exclusão lógica)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarResponsavel(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            Optional<Responsavel> responsavel = responsavelRepository.findById(id);
            if (responsavel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND);
            }
            
            Responsavel responsavelAtualizado = responsavel.get();
            responsavelAtualizado.setAtivo(false);
            responsavelRepository.save(responsavelAtualizado);
            
            return ResponseEntity.noContent();
        } catch (Exception e) {
            System.out.println("Erro ao desativar responsável ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


