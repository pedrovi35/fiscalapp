package com.fiscal.repository;

import com.fiscal.model.Responsavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para Responsavel
 * Padrão: Repository Pattern
 */
@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    
    /**
     * Busca responsável por email
     */
    Optional<Responsavel> findByEmailAndAtivoTrue(String email);
    
    /**
     * Busca responsáveis por nome (busca parcial)
     */
    @Query("SELECT r FROM Responsavel r WHERE LOWER(r.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND r.ativo = true ORDER BY r.nome ASC")
    List<Responsavel> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    /**
     * Busca responsáveis ativos
     */
    List<Responsavel> findByAtivoTrueOrderByNomeAsc();
    
    /**
     * Busca responsáveis por cargo
     */
    @Query("SELECT r FROM Responsavel r WHERE LOWER(r.cargo) LIKE LOWER(CONCAT('%', :cargo, '%')) AND r.ativo = true ORDER BY r.nome ASC")
    List<Responsavel> findByCargoContainingIgnoreCase(@Param("cargo") String cargo);
}


