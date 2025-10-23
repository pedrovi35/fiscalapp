package com.fiscal.repository;

import com.fiscal.model.Obrigacao;
import com.fiscal.model.TipoObrigacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository para Obrigacao
 * Padrão: Repository Pattern
 */
@Repository
public interface ObrigacaoRepository extends JpaRepository<Obrigacao, Long> {
    
    /**
     * Busca obrigações por cliente
     */
    List<Obrigacao> findByClienteIdAndAtivoTrueOrderByDataVencimentoAsc(Long clienteId);
    
    /**
     * Busca obrigações por responsável
     */
    List<Obrigacao> findByResponsavelIdAndAtivoTrueOrderByDataVencimentoAsc(Long responsavelId);
    
    /**
     * Busca obrigações por tipo
     */
    List<Obrigacao> findByTipoAndAtivoTrueOrderByDataVencimentoAsc(TipoObrigacao tipo);
    
    /**
     * Busca obrigações por período
     */
    @Query("SELECT o FROM Obrigacao o WHERE o.dataVencimento BETWEEN :dataInicio AND :dataFim AND o.ativo = true ORDER BY o.dataVencimento ASC")
    List<Obrigacao> findByPeriodo(@Param("dataInicio") LocalDate dataInicio, @Param("dataFim") LocalDate dataFim);
    
    /**
     * Busca obrigações próximas do vencimento
     */
    @Query("SELECT o FROM Obrigacao o WHERE o.dataVencimento BETWEEN :hoje AND :dataLimite AND o.ativo = true AND o.concluida = false ORDER BY o.dataVencimento ASC")
    List<Obrigacao> findProximasVencimento(@Param("hoje") LocalDate hoje, @Param("dataLimite") LocalDate dataLimite);
    
    /**
     * Busca obrigações vencidas
     */
    @Query("SELECT o FROM Obrigacao o WHERE o.dataVencimento < :hoje AND o.ativo = true AND o.concluida = false ORDER BY o.dataVencimento ASC")
    List<Obrigacao> findVencidas(@Param("hoje") LocalDate hoje);
    
    /**
     * Busca obrigações que precisam gerar próxima ocorrência
     */
    @Query("SELECT o FROM Obrigacao o WHERE o.dataProximaGeracao <= :hoje AND o.ativo = true AND o.tipoRecorrencia != 'UNICA' ORDER BY o.dataProximaGeracao ASC")
    List<Obrigacao> findParaGerarProximaOcorrencia(@Param("hoje") LocalDate hoje);
    
    /**
     * Busca obrigações com filtros múltiplos
     */
    @Query("SELECT o FROM Obrigacao o WHERE " +
           "(:clienteId IS NULL OR o.cliente.id = :clienteId) AND " +
           "(:responsavelId IS NULL OR o.responsavel.id = :responsavelId) AND " +
           "(:tipo IS NULL OR o.tipo = :tipo) AND " +
           "(:concluida IS NULL OR o.concluida = :concluida) AND " +
           "o.ativo = true " +
           "ORDER BY o.dataVencimento ASC")
    Page<Obrigacao> findWithFilters(@Param("clienteId") Long clienteId, 
                                   @Param("responsavelId") Long responsavelId,
                                   @Param("tipo") TipoObrigacao tipo,
                                   @Param("concluida") Boolean concluida,
                                   Pageable pageable);
    
    /**
     * Conta obrigações por status
     */
    @Query("SELECT COUNT(o) FROM Obrigacao o WHERE o.ativo = true AND o.concluida = :concluida")
    Long countByConcluida(@Param("concluida") Boolean concluida);
    
    /**
     * Conta obrigações vencidas
     */
    @Query("SELECT COUNT(o) FROM Obrigacao o WHERE o.dataVencimento < :hoje AND o.ativo = true AND o.concluida = false")
    Long countVencidas(@Param("hoje") LocalDate hoje);
}


