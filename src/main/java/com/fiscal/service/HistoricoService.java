package com.fiscal.service;

import com.fiscal.model.Obrigacao;
import com.fiscal.model.HistoricoAlteracao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Serviço para registrar alterações específicas no histórico
 * Padrão: Service Layer Pattern
 */
@Service
@Transactional
public class HistoricoService {
    
    private static final Logger log = LoggerFactory.getLogger(HistoricoService.class);
    
    private final com.fiscal.repository.HistoricoAlteracaoRepository historicoRepository;
    
    public HistoricoService(com.fiscal.repository.HistoricoAlteracaoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }
    
    /**
     * Registra a criação de uma obrigação
     */
    public void registrarCriacao(Obrigacao obrigacao, String usuarioEditor) {
        HistoricoAlteracao historico = new HistoricoAlteracao();
        historico.setObrigacao(obrigacao);
        historico.setCampoAlterado("CRIACAO");
        historico.setValorAnterior(null);
        historico.setValorNovo("Obrigação criada");
        historico.setUsuarioEditor(usuarioEditor);
        historico.setDataAlteracao(LocalDateTime.now());
        historico.setObservacoes("Nova obrigação criada: " + obrigacao.getNome());
        
        historicoRepository.save(historico);
        System.out.println("Histórico de criação registrado para obrigação ID: " + obrigacao.getId());
    }
    
    /**
     * Registra alterações em uma obrigação
     */
    public void registrarAlteracoes(Obrigacao obrigacaoOriginal, com.fiscal.model.dto.ObrigacaoRequest request) {
        LocalDateTime agora = LocalDateTime.now();
        
        // Verificar alterações em cada campo
        if (!obrigacaoOriginal.getNome().equals(request.getNome())) {
            registrarAlteracao(obrigacaoOriginal, "nome", obrigacaoOriginal.getNome(), request.getNome(), request.getUsuarioEditor(), agora);
        }
        
        if (!obrigacaoOriginal.getTipo().equals(request.getTipo())) {
            registrarAlteracao(obrigacaoOriginal, "tipo", obrigacaoOriginal.getTipo().toString(), request.getTipo().toString(), request.getUsuarioEditor(), agora);
        }
        
        if (!obrigacaoOriginal.getDataVencimento().equals(request.getDataVencimento())) {
            registrarAlteracao(obrigacaoOriginal, "dataVencimento", obrigacaoOriginal.getDataVencimento().toString(), request.getDataVencimento().toString(), request.getUsuarioEditor(), agora);
        }
        
        if (!obrigacaoOriginal.getTipoRecorrencia().equals(request.getTipoRecorrencia())) {
            registrarAlteracao(obrigacaoOriginal, "tipoRecorrencia", obrigacaoOriginal.getTipoRecorrencia().toString(), request.getTipoRecorrencia().toString(), request.getUsuarioEditor(), agora);
        }
        
        System.out.println("Histórico de alterações registrado para obrigação ID: " + obrigacaoOriginal.getId());
    }
    
    /**
     * Registra a conclusão de uma obrigação
     */
    public void registrarConclusao(Obrigacao obrigacao, String usuarioEditor) {
        HistoricoAlteracao historico = new HistoricoAlteracao();
        historico.setObrigacao(obrigacao);
        historico.setCampoAlterado("concluida");
        historico.setValorAnterior("false");
        historico.setValorNovo("true");
        historico.setUsuarioEditor(usuarioEditor);
        historico.setDataAlteracao(LocalDateTime.now());
        historico.setObservacoes("Obrigação concluída: " + obrigacao.getNome());
        
        historicoRepository.save(historico);
        System.out.println("Histórico de conclusão registrado para obrigação ID: " + obrigacao.getId());
    }
    
    /**
     * Registra uma alteração específica
     */
    public void registrarAlteracao(Obrigacao obrigacao, String campo, String valorAnterior, String valorNovo, String usuarioEditor, LocalDateTime dataAlteracao) {
        HistoricoAlteracao historico = new HistoricoAlteracao();
        historico.setObrigacao(obrigacao);
        historico.setCampoAlterado(campo);
        historico.setValorAnterior(valorAnterior);
        historico.setValorNovo(valorNovo);
        historico.setUsuarioEditor(usuarioEditor);
        historico.setDataAlteracao(dataAlteracao);
        historico.setObservacoes(String.format("Campo '%s' alterado de '%s' para '%s'", campo, valorAnterior, valorNovo));
        
        historicoRepository.save(historico);
    }
    
    /**
     * Busca histórico de uma obrigação
     */
    @Transactional(readOnly = true)
    public List<HistoricoAlteracao> buscarHistoricoObrigacao(Long obrigacaoId) {
        return historicoRepository.findByObrigacaoIdOrderByDataAlteracaoDesc(obrigacaoId);
    }
    
    /**
     * Busca últimas alterações do sistema
     */
    @Transactional(readOnly = true)
    public List<HistoricoAlteracao> buscarUltimasAlteracoes(int limite) {
        return historicoRepository.findUltimasAlteracoes(org.springframework.data.domain.PageRequest.of(0, limite))
                .getContent();
    }
}


