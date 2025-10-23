package com.fiscal.repository;

import com.fiscal.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para Cliente
 * Padrão: Repository Pattern
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    /**
     * Busca cliente por CNPJ/CPF
     */
    Optional<Cliente> findByCnpjCpfAndAtivoTrue(String cnpjCpf);
    
    /**
     * Busca clientes por nome (busca parcial)
     */
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND c.ativo = true ORDER BY c.nome ASC")
    List<Cliente> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    /**
     * Busca clientes ativos
     */
    List<Cliente> findByAtivoTrueOrderByNomeAsc();
    
    /**
     * Busca clientes com filtros
     */
    @Query("SELECT c FROM Cliente c WHERE " +
           "(:nome IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:cnpjCpf IS NULL OR c.cnpjCpf = :cnpjCpf) AND " +
           "c.ativo = true " +
           "ORDER BY c.nome ASC")
    Page<Cliente> findWithFilters(@Param("nome") String nome, 
                                 @Param("cnpjCpf") String cnpjCpf,
                                 Pageable pageable);
}


