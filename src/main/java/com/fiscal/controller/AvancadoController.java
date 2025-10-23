package com.fiscal.controller;

import com.fiscal.model.HistoricoAlteracao;
import com.fiscal.model.dto.ObrigacaoResponse;
import com.fiscal.service.HistoricoService;
import com.fiscal.service.ObrigacaoCompletaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller REST para funcionalidades avançadas
 * Padrão: REST Controller Pattern
 */
@RestController
@RequestMapping("/api/avancado")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AvancadoController {
    
    private final ObrigacaoCompletaService obrigacaoCompletaService;
    private final HistoricoService historicoService;
    
    /**
     * Busca obrigação por ID
     */
    @GetMapping("/obrigacoes/{id}")
    public ResponseEntity<ObrigacaoResponse> buscarObrigacao(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            Optional<com.fiscal.model.Obrigacao> obrigacao = obrigacaoCompletaService.buscarPorId(id);
            if (obrigacao.isPresent()) {
                // Converter para response
                return ResponseEntity.ok(converterParaResponse(obrigacao.get()));
            } else {
                return ResponseEntity.notFound();
            }
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Busca obrigações com filtros avançados
     */
    @GetMapping("/obrigacoes")
    public ResponseEntity<List<ObrigacaoResponse>> buscarObrigacoesComFiltros(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long responsavelId,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Boolean concluida,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        // Log removido temporariamente
        
        try {
            List<com.fiscal.model.Obrigacao> obrigacoes;
            
            if (dataInicio != null && dataFim != null) {
                LocalDate inicio = LocalDate.parse(dataInicio);
                LocalDate fim = LocalDate.parse(dataFim);
                obrigacoes = obrigacaoCompletaService.buscarPorPeriodo(inicio, fim);
            } else {
                com.fiscal.model.TipoObrigacao tipoEnum = tipo != null ? 
                        com.fiscal.model.TipoObrigacao.valueOf(tipo) : null;
                obrigacoes = obrigacaoCompletaService.buscarComFiltros(clienteId, responsavelId, tipoEnum, concluida);
            }
            
            List<ObrigacaoResponse> response = obrigacoes.stream()
                    .map(this::converterParaResponse)
                    .toList();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Erro ao buscar obrigações com filtros: " + e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Atualiza data de vencimento
     */
    @PatchMapping("/obrigacoes/{id}/data-vencimento")
    public ResponseEntity<ObrigacaoResponse> atualizarDataVencimento(
            @PathVariable Long id,
            @RequestParam String novaData,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            LocalDate data = LocalDate.parse(novaData);
            com.fiscal.model.Obrigacao obrigacao = obrigacaoCompletaService.atualizarDataVencimento(id, data, usuarioEditor);
            return ResponseEntity.ok(converterParaResponse(obrigacao));
        } catch (RuntimeException e) {
            System.out.println("Erro ao atualizar data de vencimento ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao atualizar data de vencimento ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Conclui obrigação
     */
    @PatchMapping("/obrigacoes/{id}/concluir")
    public ResponseEntity<ObrigacaoResponse> concluirObrigacao(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            com.fiscal.model.Obrigacao obrigacao = obrigacaoCompletaService.concluirObrigacao(id, usuarioEditor);
            return ResponseEntity.ok(converterParaResponse(obrigacao));
        } catch (RuntimeException e) {
            System.out.println("Erro ao concluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao concluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Reabre obrigação
     */
    @PatchMapping("/obrigacoes/{id}/reabrir")
    public ResponseEntity<ObrigacaoResponse> reabrirObrigacao(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            com.fiscal.model.Obrigacao obrigacao = obrigacaoCompletaService.reabrirObrigacao(id, usuarioEditor);
            return ResponseEntity.ok(converterParaResponse(obrigacao));
        } catch (RuntimeException e) {
            System.out.println("Erro ao reabrir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao reabrir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Exclui obrigação
     */
    @DeleteMapping("/obrigacoes/{id}")
    public ResponseEntity<Void> excluirObrigacao(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            obrigacaoCompletaService.excluirObrigacao(id, usuarioEditor);
            return ResponseEntity.noContent();
        } catch (RuntimeException e) {
            System.out.println("Erro ao excluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao excluir obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Duplica obrigação
     */
    @PostMapping("/obrigacoes/{id}/duplicar")
    public ResponseEntity<ObrigacaoResponse> duplicarObrigacao(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            com.fiscal.model.Obrigacao obrigacao = obrigacaoCompletaService.duplicarObrigacao(id, usuarioEditor);
            return ResponseEntity.ok(converterParaResponse(obrigacao));
        } catch (RuntimeException e) {
            System.out.println("Erro ao duplicar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao duplicar obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Gera próxima ocorrência manualmente
     */
    @PostMapping("/obrigacoes/{id}/gerar-proxima")
    public ResponseEntity<ObrigacaoResponse> gerarProximaOcorrencia(
            @PathVariable Long id,
            @RequestParam String usuarioEditor) {
        // Log removido temporariamente
        
        try {
            com.fiscal.model.Obrigacao obrigacao = obrigacaoCompletaService.gerarProximaOcorrenciaManual(id, usuarioEditor);
            return ResponseEntity.ok(converterParaResponse(obrigacao));
        } catch (RuntimeException e) {
            System.out.println("Erro ao gerar próxima ocorrência ID {}: " + id, e.getMessage());
            return ResponseEntity.status(404);
        } catch (Exception e) {
            System.out.println("Erro ao gerar próxima ocorrência ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Busca histórico de uma obrigação
     */
    @GetMapping("/obrigacoes/{id}/historico")
    public ResponseEntity<List<HistoricoAlteracao>> buscarHistoricoObrigacao(@PathVariable Long id) {
        // Log removido temporariamente
        
        try {
            List<HistoricoAlteracao> historico = historicoService.buscarHistoricoObrigacao(id);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.out.println("Erro ao buscar histórico da obrigação ID {}: " + id, e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Busca últimas alterações do sistema
     */
    @GetMapping("/historico/ultimas")
    public ResponseEntity<List<HistoricoAlteracao>> buscarUltimasAlteracoes(
            @RequestParam(defaultValue = "20") int limite) {
        // Log removido temporariamente
        
        try {
            List<HistoricoAlteracao> historico = historicoService.buscarUltimasAlteracoes(limite);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.out.println("Erro ao buscar últimas alterações: " + e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Obtém estatísticas do sistema
     */
    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Object>> obterEstatisticas() {
        // Log removido temporariamente
        
        try {
            Map<String, Object> estatisticas = obrigacaoCompletaService.obterEstatisticas();
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            System.out.println("Erro ao obter estatísticas: " + e.getMessage());
            return ResponseEntity.status(500);
        }
    }
    
    /**
     * Converte entidade para DTO de resposta
     */
    private ObrigacaoResponse converterParaResponse(com.fiscal.model.Obrigacao obrigacao) {
        long diasParaVencimento = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), obrigacao.getDataVencimento());
        
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


