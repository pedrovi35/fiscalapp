package com.fiscal.controller;

import com.fiscal.model.Cliente;
import com.fiscal.repository.ClienteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para gerenciamento de clientes
 * Padrão: REST Controller Pattern
 */
@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ClienteController {
    
    private final ClienteRepository clienteRepository;
    
    /**
     * Cria um novo cliente
     */
    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@Valid @RequestBody Cliente cliente) {
        System.out.println("Recebida requisição para criar cliente: " + cliente.getNome());
        
        try {
            Cliente clienteSalvo = clienteRepository.save(cliente);
            return ResponseEntity.ok(null) // ResponseEntity temporariamente simplificado;
        } catch (Exception e) {
            System.out.println("Erro ao criar cliente: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Atualiza um cliente existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizarCliente(
            @PathVariable Long id, 
            @Valid @RequestBody Cliente cliente) {
        // Log removido temporariamente
        
        try {
            Optional<Cliente> clienteExistente = clienteRepository.findById(id);
            if (clienteExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND);
            }
            
            cliente.setId(id);
            Cliente clienteSalvo = clienteRepository.save(cliente);
            return ResponseEntity.ok(clienteSalvo);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar cliente ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * Busca todos os clientes
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> buscarClientes() {
        // Log removido temporariamente
        
        try {
            List<Cliente> clientes = clienteRepository.findByAtivoTrueOrderByNomeAsc();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            System.out.println("Erro ao buscar clientes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca clientes com filtros
     */
    @GetMapping("/buscar")
    public ResponseEntity<Page<Cliente>> buscarClientesComFiltros(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cnpjCpf,
            Pageable pageable) {
        // Log removido temporariamente
        
        try {
            Page<Cliente> clientes = clienteRepository.findWithFilters(nome, cnpjCpf, pageable);
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            System.out.println("Erro ao buscar clientes com filtros: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca um cliente por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            Optional<Cliente> cliente = clienteRepository.findById(id);
            return cliente.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.out.println("Erro ao buscar cliente ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Busca cliente por CNPJ/CPF
     */
    @GetMapping("/cnpj-cpf/{cnpjCpf}")
    public ResponseEntity<Cliente> buscarClientePorCnpjCpf(@PathVariable String cnpjCpf) {
        // Log removido temporariamente
        
        try {
            Optional<Cliente> cliente = clienteRepository.findByCnpjCpfAndAtivoTrue(cnpjCpf);
            return cliente.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.out.println("Erro ao buscar cliente por CNPJ/CPF {}: " + cnpjCpf, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Desativa um cliente (exclusão lógica)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativarCliente(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            Optional<Cliente> cliente = clienteRepository.findById(id);
            if (cliente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND);
            }
            
            Cliente clienteAtualizado = cliente.get();
            clienteAtualizado.setAtivo(false);
            clienteRepository.save(clienteAtualizado);
            
            return ResponseEntity.noContent();
        } catch (Exception e) {
            System.out.println("Erro ao desativar cliente ID {}: " + id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


