package com.fiscal.service;

import com.fiscal.model.Obrigacao;
import com.fiscal.model.dto.ObrigacaoRequest;
import com.fiscal.repository.ObrigacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Serviço para gerenciamento completo de obrigações
 * Padrão: Service Layer Pattern + Facade Pattern
 */
@Service
@Transactional
public class ObrigacaoCompletaService {
    
    private static final Logger log = LoggerFactory.getLogger(ObrigacaoCompletaService.class);
    
    private final ObrigacaoRepository obrigacaoRepository;
    private final HistoricoService historicoService;
    private final NotificacaoService notificacaoService;
    private final DataService dataService;
    private final RecorrenciaService recorrenciaService;
    
    public ObrigacaoCompletaService(ObrigacaoRepository obrigacaoRepository, 
                                   HistoricoService historicoService, 
                                   NotificacaoService notificacaoService, 
                                   DataService dataService, 
                                   RecorrenciaService recorrenciaService) {
        this.obrigacaoRepository = obrigacaoRepository;
        this.historicoService = historicoService;
        this.notificacaoService = notificacaoService;
        this.dataService = dataService;
        this.recorrenciaService = recorrenciaService;
    }
    
    /**
     * Busca obrigação por ID
     */
    @Transactional(readOnly = true)
    public Optional<Obrigacao> buscarPorId(Long id) {
        return obrigacaoRepository.findById(id);
    }
    
    /**
     * Busca todas as obrigações com filtros
     */
    @Transactional(readOnly = true)
    public List<Obrigacao> buscarComFiltros(Long clienteId, Long responsavelId, 
                                          com.fiscal.model.TipoObrigacao tipo, Boolean concluida) {
        return obrigacaoRepository.findWithFilters(clienteId, responsavelId, tipo, concluida, 
                org.springframework.data.domain.PageRequest.of(0, 1000)).getContent();
    }
    
    /**
     * Busca obrigações por período
     */
    @Transactional(readOnly = true)
    public List<Obrigacao> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return obrigacaoRepository.findByPeriodo(dataInicio, dataFim);
    }
    
    /**
     * Busca obrigações por cliente
     */
    @Transactional(readOnly = true)
    public List<Obrigacao> buscarPorCliente(Long clienteId) {
        return obrigacaoRepository.findByClienteIdAndAtivoTrueOrderByDataVencimentoAsc(clienteId);
    }
    
    /**
     * Busca obrigações por responsável
     */
    @Transactional(readOnly = true)
    public List<Obrigacao> buscarPorResponsavel(Long responsavelId) {
        return obrigacaoRepository.findByResponsavelIdAndAtivoTrueOrderByDataVencimentoAsc(responsavelId);
    }
    
    /**
     * Busca obrigações por tipo
     */
    @Transactional(readOnly = true)
    public List<Obrigacao> buscarPorTipo(com.fiscal.model.TipoObrigacao tipo) {
        return obrigacaoRepository.findByTipoAndAtivoTrueOrderByDataVencimentoAsc(tipo);
    }
    
    /**
     * Atualiza data de vencimento de uma obrigação
     */
    public Obrigacao atualizarDataVencimento(Long id, LocalDate novaData, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        LocalDate dataAnterior = obrigacao.getDataVencimento();
        
        // Ajustar nova data se necessário
        LocalDate dataAjustada = dataService.ajustarDataVencimento(
                novaData, 
                obrigacao.getAjustarFinaisSemana(), 
                obrigacao.getAjustarFeriados()
        );
        
        obrigacao.setDataVencimento(dataAjustada);
        obrigacao.setUltimoEditor(usuarioEditor);
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarAlteracao(obrigacao, "dataVencimento", 
                dataAnterior.toString(), dataAjustada.toString(), usuarioEditor, LocalDateTime.now());
        
        // Notificar atualização
        notificacaoService.notificarAtualizacaoObrigacao(salva.getId(), salva.getNome(), usuarioEditor);
        
        System.out.println("Data de vencimento atualizada com sucesso: ID " + salva.getId());
        return salva;
    }
    
    /**
     * Marca obrigação como concluída
     */
    public Obrigacao concluirObrigacao(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        obrigacao.setConcluida(true);
        obrigacao.setDataConclusao(LocalDate.now());
        obrigacao.setUltimoEditor(usuarioEditor);
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarConclusao(salva, usuarioEditor);
        
        // Notificar conclusão
        notificacaoService.notificarConclusaoObrigacao(salva.getId(), salva.getNome(), usuarioEditor);
        
        System.out.println("Obrigação concluída com sucesso: ID " + salva.getId());
        return salva;
    }
    
    /**
     * Reabre obrigação concluída
     */
    public Obrigacao reabrirObrigacao(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        obrigacao.setConcluida(false);
        obrigacao.setDataConclusao(null);
        obrigacao.setUltimoEditor(usuarioEditor);
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarAlteracao(obrigacao, "concluida", "true", "false", usuarioEditor, LocalDateTime.now());
        
        // Notificar reabertura
        notificacaoService.notificarAtualizacaoObrigacao(salva.getId(), salva.getNome(), usuarioEditor);
        
        System.out.println("Obrigação reaberta com sucesso: ID " + salva.getId());
        return salva;
    }
    
    /**
     * Exclui obrigação (exclusão lógica)
     */
    public void excluirObrigacao(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        obrigacao.setAtivo(false);
        obrigacao.setUltimoEditor(usuarioEditor);
        
        obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarAlteracao(obrigacao, "ativo", "true", "false", usuarioEditor, LocalDateTime.now());
        
        // Notificar exclusão
        notificacaoService.notificarExclusaoObrigacao(obrigacao.getId(), obrigacao.getNome(), usuarioEditor);
        
        // Log removido temporariamente
    }
    
    /**
     * Duplica uma obrigação
     */
    public Obrigacao duplicarObrigacao(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacaoOriginal = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        Obrigacao novaObrigacao = new Obrigacao();
        novaObrigacao.setNome(obrigacaoOriginal.getNome() + " (Cópia)");
        novaObrigacao.setTipo(obrigacaoOriginal.getTipo());
        novaObrigacao.setDescricao(obrigacaoOriginal.getDescricao());
        novaObrigacao.setCliente(obrigacaoOriginal.getCliente());
        novaObrigacao.setResponsavel(obrigacaoOriginal.getResponsavel());
        novaObrigacao.setDataVencimento(obrigacaoOriginal.getDataVencimento().plusDays(1));
        novaObrigacao.setTipoRecorrencia(com.fiscal.model.TipoRecorrencia.UNICA);
        novaObrigacao.setAjustarFinaisSemana(obrigacaoOriginal.getAjustarFinaisSemana());
        novaObrigacao.setAjustarFeriados(obrigacaoOriginal.getAjustarFeriados());
        novaObrigacao.setUltimoEditor(usuarioEditor);
        
        Obrigacao salva = obrigacaoRepository.save(novaObrigacao);
        
        // Registrar no histórico
        historicoService.registrarCriacao(salva, usuarioEditor);
        
        // Notificar criação
        notificacaoService.notificarCriacaoObrigacao(salva.getId(), salva.getNome(), usuarioEditor);
        
        System.out.println("Obrigação duplicada com sucesso: ID " + salva.getId());
        return salva;
    }
    
    /**
     * Gera próxima ocorrência manualmente
     */
    public Obrigacao gerarProximaOcorrenciaManual(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        if (obrigacao.getTipoRecorrencia() == com.fiscal.model.TipoRecorrencia.UNICA) {
            throw new RuntimeException("Obrigação não possui recorrência configurada");
        }
        
        Obrigacao novaObrigacao = recorrenciaService.gerarProximaOcorrencia(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarCriacao(novaObrigacao, usuarioEditor);
        
        // Notificar criação
        notificacaoService.notificarCriacaoObrigacao(novaObrigacao.getId(), novaObrigacao.getNome(), usuarioEditor);
        
        System.out.println("Próxima ocorrência gerada manualmente: ID " + novaObrigacao.getId());
        return novaObrigacao;
    }
    
    /**
     * Obtém estatísticas do sistema
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> obterEstatisticas() {
        LocalDate hoje = LocalDate.now();
        
        long totalObrigacoes = obrigacaoRepository.countByConcluida(false);
        long obrigacoesConcluidas = obrigacaoRepository.countByConcluida(true);
        long obrigacoesVencidas = obrigacaoRepository.countVencidas(hoje);
        
        List<Obrigacao> proximasVencimento = obrigacaoRepository.findProximasVencimento(hoje, hoje.plusDays(7));
        
        java.util.Map<String, Object> estatisticas = new java.util.HashMap<>();
        estatisticas.put("totalObrigacoes", totalObrigacoes);
        estatisticas.put("obrigacoesConcluidas", obrigacoesConcluidas);
        estatisticas.put("obrigacoesVencidas", obrigacoesVencidas);
        estatisticas.put("proximasVencimento", proximasVencimento.size());
        estatisticas.put("dataAtualizacao", java.time.LocalDateTime.now());
        
        return estatisticas;
    }
}


