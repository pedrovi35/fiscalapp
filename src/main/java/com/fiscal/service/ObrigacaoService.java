package com.fiscal.service;

import com.fiscal.model.*;
import com.fiscal.model.dto.ObrigacaoRequest;
import com.fiscal.model.dto.ObrigacaoResponse;
import com.fiscal.repository.ObrigacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço principal para gerenciamento de obrigações
 * Padrão: Service Layer Pattern + Facade Pattern
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ObrigacaoService {
    
    private final ObrigacaoRepository obrigacaoRepository;
    private final HistoricoService historicoService;
    private final RecorrenciaService recorrenciaService;
    private final DataService dataService;
    
    /**
     * Cria uma nova obrigação
     */
    public ObrigacaoResponse criarObrigacao(ObrigacaoRequest request) {
        System.out.println("Criando nova obrigação: " + request.getNome());
        
        Obrigacao obrigacao = // Obrigacao.new 
                .nome(request.getNome())
                .tipo(request.getTipo())
                .descricao(request.getDescricao())
                .dataVencimento(request.getDataVencimento())
                .tipoRecorrencia(request.getTipoRecorrencia())
                .diasRecorrencia(request.getDiasRecorrencia())
                .diaMesRecorrencia(request.getDiaMesRecorrencia())
                .ajustarFinaisSemana(request.getAjustarFinaisSemana() != null ? request.getAjustarFinaisSemana() : true)
                .ajustarFeriados(request.getAjustarFeriados() != null ? request.getAjustarFeriados() : true)
                .ultimoEditor(request.getUsuarioEditor())
                ;
        
        // Ajustar data de vencimento se necessário
        LocalDate dataAjustada = dataService.ajustarDataVencimento(
                obrigacao.getDataVencimento(), 
                obrigacao.getAjustarFinaisSemana(), 
                obrigacao.getAjustarFeriados()
        );
        obrigacao.setDataVencimento(dataAjustada);
        
        // Calcular próxima data de geração para recorrências
        if (obrigacao.getTipoRecorrencia() != TipoRecorrencia.UNICA) {
            LocalDate proximaGeracao = recorrenciaService.calcularProximaDataGeracao(obrigacao);
            obrigacao.setDataProximaGeracao(proximaGeracao);
        }
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarCriacao(salva, request.getUsuarioEditor());
        
        System.out.println("Obrigação criada com sucesso: ID " + salva.getId());
        return converterParaResponse(salva);
    }
    
    /**
     * Atualiza uma obrigação existente
     */
    public ObrigacaoResponse atualizarObrigacao(Long id, ObrigacaoRequest request) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        // Registrar alterações no histórico
        historicoService.registrarAlteracoes(obrigacao, request);
        
        // Atualizar campos
        obrigacao.setNome(request.getNome());
        obrigacao.setTipo(request.getTipo());
        obrigacao.setDescricao(request.getDescricao());
        obrigacao.setDataVencimento(request.getDataVencimento());
        obrigacao.setTipoRecorrencia(request.getTipoRecorrencia());
        obrigacao.setDiasRecorrencia(request.getDiasRecorrencia());
        obrigacao.setDiaMesRecorrencia(request.getDiaMesRecorrencia());
        obrigacao.setAjustarFinaisSemana(request.getAjustarFinaisSemana());
        obrigacao.setAjustarFeriados(request.getAjustarFeriados());
        obrigacao.setUltimoEditor(request.getUsuarioEditor());
        
        // Ajustar data de vencimento se necessário
        LocalDate dataAjustada = dataService.ajustarDataVencimento(
                obrigacao.getDataVencimento(), 
                obrigacao.getAjustarFinaisSemana(), 
                obrigacao.getAjustarFeriados()
        );
        obrigacao.setDataVencimento(dataAjustada);
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        System.out.println("Obrigação atualizada com sucesso: ID " + salva.getId());
        return converterParaResponse(salva);
    }
    
    /**
     * Marca obrigação como concluída
     */
    public ObrigacaoResponse concluirObrigacao(Long id, String usuarioEditor) {
        // Log removido temporariamente
        
        Obrigacao obrigacao = obrigacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obrigação não encontrada"));
        
        obrigacao.setConcluida(true);
        obrigacao.setDataConclusao(LocalDate.now());
        obrigacao.setUltimoEditor(usuarioEditor);
        
        Obrigacao salva = obrigacaoRepository.save(obrigacao);
        
        // Registrar no histórico
        historicoService.registrarConclusao(salva, usuarioEditor);
        
        System.out.println("Obrigação concluída com sucesso: ID " + salva.getId());
        return converterParaResponse(salva);
    }
    
    /**
     * Busca obrigações próximas do vencimento
     */
    @Transactional(readOnly = true)
    public List<ObrigacaoResponse> buscarProximasVencimento(int dias) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataLimite = hoje.plusDays(dias);
        
        List<Obrigacao> obrigacoes = obrigacaoRepository.findProximasVencimento(hoje, dataLimite);
        
        return obrigacoes.stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca obrigações vencidas
     */
    @Transactional(readOnly = true)
    public List<ObrigacaoResponse> buscarVencidas() {
        List<Obrigacao> obrigacoes = obrigacaoRepository.findVencidas(LocalDate.now());
        
        return obrigacoes.stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Converte entidade para DTO de resposta
     */
    private ObrigacaoResponse converterParaResponse(Obrigacao obrigacao) {
        long diasParaVencimento = ChronoUnit.DAYS.between(LocalDate.now(), obrigacao.getDataVencimento());
        
        String statusUrgencia = calcularStatusUrgencia(diasParaVencimento);
        
        return ObrigacaoResponsenew 
                .id(obrigacao.getId())
                .nome(obrigacao.getNome())
                .tipo(obrigacao.getTipo())
                .descricao(obrigacao.getDescricao())
                .cliente(obrigacao.getCliente())
                .responsavel(obrigacao.getResponsavel())
                .dataVencimento(obrigacao.getDataVencimento())
                .tipoRecorrencia(obrigacao.getTipoRecorrencia())
                .diasRecorrencia(obrigacao.getDiasRecorrencia())
                .diaMesRecorrencia(obrigacao.getDiaMesRecorrencia())
                .ajustarFinaisSemana(obrigacao.getAjustarFinaisSemana())
                .ajustarFeriados(obrigacao.getAjustarFeriados())
                .dataProximaGeracao(obrigacao.getDataProximaGeracao())
                .ativo(obrigacao.getAtivo())
                .concluida(obrigacao.getConcluida())
                .dataConclusao(obrigacao.getDataConclusao())
                .dataCriacao(obrigacao.getDataCriacao())
                .dataAtualizacao(obrigacao.getDataAtualizacao())
                .ultimoEditor(obrigacao.getUltimoEditor())
                .diasParaVencimento(diasParaVencimento)
                .statusUrgencia(statusUrgencia)
                ;
    }
    
    /**
     * Calcula status de urgência baseado nos dias para vencimento
     */
    private String calcularStatusUrgencia(long diasParaVencimento) {
        if (diasParaVencimento < 0) {
            return "VENCIDA";
        } else if (diasParaVencimento <= 3) {
            return "CRÍTICA";
        } else if (diasParaVencimento <= 7) {
            return "URGENTE";
        } else if (diasParaVencimento <= 15) {
            return "ATENÇÃO";
        } else {
            return "NORMAL";
        }
    }
}


