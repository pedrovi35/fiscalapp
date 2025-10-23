package com.fiscal.service;

import com.fiscal.model.Obrigacao;
import com.fiscal.repository.ObrigacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Serviço para processamento automático de recorrências
 * Padrão: Service Layer Pattern + Scheduled Task Pattern
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RecorrenciaSchedulerService {
    
    private final RecorrenciaService recorrenciaService;
    private final ObrigacaoRepository obrigacaoRepository;
    private final NotificacaoService notificacaoService;
    
    /**
     * Processa recorrências automaticamente todos os dias às 6:00
     * Padrão: Cron Job Pattern
     */
    @Scheduled(cron = "0 0 6 * * *")
    public void processarRecorrenciasDiarias() {
        // Log removido temporariamente
        
        try {
            List<Obrigacao> obrigacoesParaProcessar = obrigacaoRepository.findParaGerarProximaOcorrencia(LocalDate.now());
            
            if (obrigacoesParaProcessar.isEmpty()) {
                // Log removido temporariamente
                return;
            }
            
            int processadas = 0;
            for (Obrigacao obrigacao : obrigacoesParaProcessar) {
                try {
                    Obrigacao novaObrigacao = recorrenciaService.gerarProximaOcorrencia(obrigacao);
                    
                    // Notificar criação da nova obrigação
                    notificacaoService.notificarCriacaoObrigacao(
                            novaObrigacao.getId(),
                            novaObrigacao.getNome(),
                            "Sistema"
                    );
                    
                    processadas++;
                    System.out.println("Recorrência processada para obrigação ID: " + obrigacao.getId());
                    
                } catch (Exception e) {
                    System.out.println("Erro ao processar recorrência para obrigação ID " + obrigacao.getId() + ": " + e.getMessage());
                }
            }
            
            // Log removido temporariamente
            
        } catch (Exception e) {
            System.out.println("Erro no processamento diário de recorrências: " + e.getMessage());
        }
    }
    
    /**
     * Verifica obrigações próximas do vencimento e envia alertas
     * Executa a cada 4 horas
     */
    @Scheduled(cron = "0 0 */4 * * *")
    public void verificarAlertasVencimento() {
        // Log removido temporariamente
        
        try {
            LocalDate hoje = LocalDate.now();
            
            // Verificar obrigações que vencem hoje
            List<Obrigacao> venceHoje = obrigacaoRepository.findProximasVencimento(hoje, hoje);
            for (Obrigacao obrigacao : venceHoje) {
                if (!obrigacao.getConcluida()) {
                    notificacaoService.notificarAlertaVencimento(
                            obrigacao.getId(),
                            obrigacao.getNome(),
                            0
                    );
                }
            }
            
            // Verificar obrigações que vencem em 3 dias
            List<Obrigacao> venceEm3Dias = obrigacaoRepository.findProximasVencimento(hoje.plusDays(1), hoje.plusDays(3));
            for (Obrigacao obrigacao : venceEm3Dias) {
                if (!obrigacao.getConcluida()) {
                    long diasParaVencimento = java.time.temporal.ChronoUnit.DAYS.between(hoje, obrigacao.getDataVencimento());
                    notificacaoService.notificarAlertaVencimento(
                            obrigacao.getId(),
                            obrigacao.getNome(),
                            (int) diasParaVencimento
                    );
                }
            }
            
            // Log removido temporariamente
            
        } catch (Exception e) {
            System.out.println("Erro na verificação de alertas: " + e.getMessage());
        }
    }
    
    /**
     * Limpa dados antigos do histórico (manter apenas últimos 2 anos)
     * Executa mensalmente no dia 1 às 2:00
     */
    @Scheduled(cron = "0 0 2 1 * *")
    public void limparHistoricoAntigo() {
        // Log removido temporariamente
        
        try {
            LocalDate dataLimite = LocalDate.now().minusYears(2);
            
            // Implementar limpeza de histórico antigo
            // Por enquanto, apenas log
            // Log removido temporariamente
            
        } catch (Exception e) {
            System.out.println("Erro na limpeza de histórico: " + e.getMessage());
        }
    }
    
    /**
     * Gera relatório mensal de estatísticas
     * Executa no último dia do mês às 23:00
     */
    @Scheduled(cron = "0 0 23 L * *")
    public void gerarRelatorioMensal() {
        // Log removido temporariamente
        
        try {
            LocalDate hoje = LocalDate.now();
            LocalDate inicioMes = hoje.withDayOfMonth(1);
            LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());
            
            // Estatísticas do mês
            long totalObrigacoes = obrigacaoRepository.countByConcluida(false);
            long obrigacoesConcluidas = obrigacaoRepository.countByConcluida(true);
            long obrigacoesVencidas = obrigacaoRepository.countVencidas(hoje);
            
            // Log removido temporariamente
            
            // Notificar estatísticas via WebSocket
            com.fiscal.model.dto.NotificacaoTempoReal notificacao = new com.fiscal.model.dto.NotificacaoTempoReal();
            notificacao.setTipo(com.fiscal.model.dto.NotificacaoTempoReal.TipoNotificacao.OBRIGACAO_ATUALIZADA);
            notificacao.setMensagem(String.format("Relatório mensal: %d obrigações, %d concluídas, %d vencidas", 
                    totalObrigacoes, obrigacoesConcluidas, obrigacoesVencidas));
            notificacao.setUsuarioEditor("Sistema");
            notificacao.setTimestamp(java.time.LocalDateTime.now());
            
            notificacaoService.notificarTodos(notificacao);
            
        } catch (Exception e) {
            System.out.println("Erro na geração do relatório mensal: " + e.getMessage());
        }
    }
}


