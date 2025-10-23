package com.fiscal.repository;

import com.fiscal.model.HistoricoAlteracao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para HistoricoAlteracao
 * Padrão: Repository Pattern
 */
@Repository
public interface HistoricoAlteracaoRepository extends JpaRepository<HistoricoAlteracao, Long> {
    
    /**
     * Busca histórico por obrigação
     */
    List<HistoricoAlteracao> findByObrigacaoIdOrderByDataAlteracaoDesc(Long obrigacaoId);
    
    /**
     * Busca histórico por período
     */
    @Query("SELECT h FROM HistoricoAlteracao h WHERE h.dataAlteracao BETWEEN :dataInicio AND :dataFim ORDER BY h.dataAlteracao DESC")
    List<HistoricoAlteracao> findByPeriodo(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Busca histórico por usuário
     */
    @Query("SELECT h FROM HistoricoAlteracao h WHERE h.usuarioEditor = :usuario ORDER BY h.dataAlteracao DESC")
    List<HistoricoAlteracao> findByUsuarioEditor(@Param("usuario") String usuario);
    
    /**
     * Busca últimas alterações
     */
    @Query("SELECT h FROM HistoricoAlteracao h ORDER BY h.dataAlteracao DESC")
    Page<HistoricoAlteracao> findUltimasAlteracoes(Pageable pageable);
    
    /**
     * Conta alterações por obrigação
     */
    Long countByObrigacaoId(Long obrigacaoId);
}


