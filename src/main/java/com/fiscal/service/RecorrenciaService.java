package com.fiscal.service;

import com.fiscal.model.Obrigacao;
import com.fiscal.model.TipoRecorrencia;
import com.fiscal.repository.ObrigacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Serviço para gerenciamento de recorrências
 * Padrão: Service Layer Pattern + Strategy Pattern
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RecorrenciaService {
    
    private final ObrigacaoRepository obrigacaoRepository;
    private final DataService dataService;
    
    /**
     * Calcula a próxima data de geração para uma obrigação recorrente
     */
    public LocalDate calcularProximaDataGeracao(Obrigacao obrigacao) {
        LocalDate hoje = LocalDate.now();
        LocalDate proximaData;
        
        switch (obrigacao.getTipoRecorrencia()) {
            case MENSAL:
                proximaData = calcularProximaDataMensal(obrigacao, hoje);
                break;
            case TRIMESTRAL:
                proximaData = calcularProximaDataTrimestral(obrigacao, hoje);
                break;
            case SEMESTRAL:
                proximaData = calcularProximaDataSemestral(obrigacao, hoje);
                break;
            case ANUAL:
                proximaData = calcularProximaDataAnual(obrigacao, hoje);
                break;
            case CUSTOMIZADA:
                proximaData = calcularProximaDataCustomizada(obrigacao, hoje);
                break;
            default:
                proximaData = hoje.plusMonths(1);
        }
        
        return proximaData;
    }
    
    /**
     * Gera próxima ocorrência de uma obrigação recorrente
     */
    public Obrigacao gerarProximaOcorrencia(Obrigacao obrigacaoOriginal) {
        System.out.println("Gerando próxima ocorrência para obrigação ID: " + obrigacaoOriginal.getId());
        
        LocalDate novaDataVencimento = calcularNovaDataVencimento(obrigacaoOriginal);
        
        Obrigacao novaObrigacao = // Obrigacao.new 
                .nome(obrigacaoOriginal.getNome())
                .tipo(obrigacaoOriginal.getTipo())
                .descricao(obrigacaoOriginal.getDescricao())
                .cliente(obrigacaoOriginal.getCliente())
                .responsavel(obrigacaoOriginal.getResponsavel())
                .dataVencimento(novaDataVencimento)
                .tipoRecorrencia(obrigacaoOriginal.getTipoRecorrencia())
                .diasRecorrencia(obrigacaoOriginal.getDiasRecorrencia())
                .diaMesRecorrencia(obrigacaoOriginal.getDiaMesRecorrencia())
                .ajustarFinaisSemana(obrigacaoOriginal.getAjustarFinaisSemana())
                .ajustarFeriados(obrigacaoOriginal.getAjustarFeriados())
                .ultimoEditor("Sistema")
                ;
        
        // Calcular próxima data de geração
        LocalDate proximaGeracao = calcularProximaDataGeracao(novaObrigacao);
        novaObrigacao.setDataProximaGeracao(proximaGeracao);
        
        Obrigacao salva = obrigacaoRepository.save(novaObrigacao);
        
        // Atualizar data de próxima geração da obrigação original
        obrigacaoOriginal.setDataProximaGeracao(proximaGeracao);
        obrigacaoRepository.save(obrigacaoOriginal);
        
        System.out.println("Nova ocorrência gerada com sucesso: ID " + salva.getId());
        return salva;
    }
    
    /**
     * Processa todas as obrigações que precisam gerar próxima ocorrência
     */
    public void processarRecorrencias() {
        // Log removido temporariamente
        
        List<Obrigacao> obrigacoesParaProcessar = obrigacaoRepository.findParaGerarProximaOcorrencia(LocalDate.now());
        
        for (Obrigacao obrigacao : obrigacoesParaProcessar) {
            try {
                gerarProximaOcorrencia(obrigacao);
            } catch (Exception e) {
                System.out.println("Erro ao processar recorrência para obrigação ID {}: " + obrigacao.getId(), e.getMessage());
            }
        }
        
        System.out.println("Processamento de recorrências concluído. {} obrigações processadas", obrigacoesParaProcessar.size());
    }
    
    /**
     * Calcula próxima data para recorrência mensal
     */
    private LocalDate calcularProximaDataMensal(Obrigacao obrigacao, LocalDate hoje) {
        LocalDate proximaData = hoje.plusMonths(1);
        
        if (obrigacao.getDiaMesRecorrencia() != null) {
            proximaData = proximaData.withDayOfMonth(obrigacao.getDiaMesRecorrencia());
        }
        
        return dataService.ajustarDataVencimento(proximaData, obrigacao.getAjustarFinaisSemana(), obrigacao.getAjustarFeriados());
    }
    
    /**
     * Calcula próxima data para recorrência trimestral
     */
    private LocalDate calcularProximaDataTrimestral(Obrigacao obrigacao, LocalDate hoje) {
        LocalDate proximaData = hoje.plusMonths(3);
        
        if (obrigacao.getDiaMesRecorrencia() != null) {
            proximaData = proximaData.withDayOfMonth(obrigacao.getDiaMesRecorrencia());
        }
        
        return dataService.ajustarDataVencimento(proximaData, obrigacao.getAjustarFinaisSemana(), obrigacao.getAjustarFeriados());
    }
    
    /**
     * Calcula próxima data para recorrência semestral
     */
    private LocalDate calcularProximaDataSemestral(Obrigacao obrigacao, LocalDate hoje) {
        LocalDate proximaData = hoje.plusMonths(6);
        
        if (obrigacao.getDiaMesRecorrencia() != null) {
            proximaData = proximaData.withDayOfMonth(obrigacao.getDiaMesRecorrencia());
        }
        
        return dataService.ajustarDataVencimento(proximaData, obrigacao.getAjustarFinaisSemana(), obrigacao.getAjustarFeriados());
    }
    
    /**
     * Calcula próxima data para recorrência anual
     */
    private LocalDate calcularProximaDataAnual(Obrigacao obrigacao, LocalDate hoje) {
        LocalDate proximaData = hoje.plusYears(1);
        
        if (obrigacao.getDiaMesRecorrencia() != null) {
            proximaData = proximaData.withDayOfMonth(obrigacao.getDiaMesRecorrencia());
        }
        
        return dataService.ajustarDataVencimento(proximaData, obrigacao.getAjustarFinaisSemana(), obrigacao.getAjustarFeriados());
    }
    
    /**
     * Calcula próxima data para recorrência customizada
     */
    private LocalDate calcularProximaDataCustomizada(Obrigacao obrigacao, LocalDate hoje) {
        if (obrigacao.getDiasRecorrencia() != null) {
            LocalDate proximaData = hoje.plusDays(obrigacao.getDiasRecorrencia());
            return dataService.ajustarDataVencimento(proximaData, obrigacao.getAjustarFinaisSemana(), obrigacao.getAjustarFeriados());
        }
        
        return hoje.plusMonths(1);
    }
    
    /**
     * Calcula nova data de vencimento baseada na recorrência
     */
    private LocalDate calcularNovaDataVencimento(Obrigacao obrigacaoOriginal) {
        LocalDate dataOriginal = obrigacaoOriginal.getDataVencimento();
        LocalDate novaData;
        
        switch (obrigacaoOriginal.getTipoRecorrencia()) {
            case MENSAL:
                novaData = dataOriginal.plusMonths(1);
                break;
            case TRIMESTRAL:
                novaData = dataOriginal.plusMonths(3);
                break;
            case SEMESTRAL:
                novaData = dataOriginal.plusMonths(6);
                break;
            case ANUAL:
                novaData = dataOriginal.plusYears(1);
                break;
            case CUSTOMIZADA:
                if (obrigacaoOriginal.getDiasRecorrencia() != null) {
                    novaData = dataOriginal.plusDays(obrigacaoOriginal.getDiasRecorrencia());
                } else {
                    novaData = dataOriginal.plusMonths(1);
                }
                break;
            default:
                novaData = dataOriginal.plusMonths(1);
        }
        
        return dataService.ajustarDataVencimento(novaData, obrigacaoOriginal.getAjustarFinaisSemana(), obrigacaoOriginal.getAjustarFeriados());
    }
}


