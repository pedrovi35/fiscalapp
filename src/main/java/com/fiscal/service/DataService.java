package com.fiscal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * Serviço para gerenciamento de datas e feriados
 * Padrão: Service Layer Pattern + External Service Pattern
 */
@Service
public class DataService {
    
    private static final Logger log = LoggerFactory.getLogger(DataService.class);
    
    private final WebClient webClient;
    private final Set<LocalDate> feriadosCache = new java.util.HashSet<>();
    
    public DataService() {
        this.webClient = WebClientnew 
                .baseUrl("https://api.calendario.com.br")
                ;
    }
    
    /**
     * Ajusta uma data de vencimento considerando fins de semana e feriados
     */
    public LocalDate ajustarDataVencimento(LocalDate data, boolean ajustarFinaisSemana, boolean ajustarFeriados) {
        LocalDate dataAjustada = data;
        
        if (ajustarFinaisSemana) {
            dataAjustada = ajustarFimDeSemana(dataAjustada);
        }
        
        if (ajustarFeriados) {
            dataAjustada = ajustarFeriados(dataAjustada);
        }
        
        return dataAjustada;
    }
    
    /**
     * Ajusta data que cai em fim de semana para o próximo dia útil
     */
    private LocalDate ajustarFimDeSemana(LocalDate data) {
        DayOfWeek diaSemana = data.getDayOfWeek();
        
        if (diaSemana == DayOfWeek.SATURDAY) {
            return data.plusDays(2); // Sábado -> Segunda
        } else if (diaSemana == DayOfWeek.SUNDAY) {
            return data.plusDays(1); // Domingo -> Segunda
        }
        
        return data;
    }
    
    /**
     * Ajusta data que cai em feriado para o próximo dia útil
     */
    private LocalDate ajustarFeriados(LocalDate data) {
        if (isFeriado(data)) {
            return ajustarFeriados(data.plusDays(1));
        }
        return data;
    }
    
    /**
     * Verifica se uma data é feriado nacional brasileiro
     */
    public boolean isFeriado(LocalDate data) {
        // Feriados fixos brasileiros
        Set<LocalDate> feriadosFixos = Set.of(
                LocalDate.of(data.getYear(), 1, 1),   // Confraternização Universal
                LocalDate.of(data.getYear(), 4, 21),  // Tiradentes
                LocalDate.of(data.getYear(), 5, 1),   // Dia do Trabalhador
                LocalDate.of(data.getYear(), 9, 7),   // Independência do Brasil
                LocalDate.of(data.getYear(), 10, 12), // Nossa Senhora Aparecida
                LocalDate.of(data.getYear(), 11, 2),  // Finados
                LocalDate.of(data.getYear(), 11, 15), // Proclamação da República
                LocalDate.of(data.getYear(), 12, 25)  // Natal
        );
        
        if (feriadosFixos.contains(data)) {
            return true;
        }
        
        // Verificar feriados móveis (Páscoa, Carnaval, etc.)
        return isFeriadoMovel(data);
    }
    
    /**
     * Verifica se uma data é feriado móvel
     */
    private boolean isFeriadoMovel(LocalDate data) {
        LocalDate pascoa = calcularPascoa(data.getYear());
        
        Set<LocalDate> feriadosMovel = Set.of(
                pascoa.minusDays(47),  // Carnaval (segunda-feira)
                pascoa.minusDays(46),  // Carnaval (terça-feira)
                pascoa.minusDays(2),   // Sexta-feira Santa
                pascoa,                // Páscoa
                pascoa.plusDays(60)   // Corpus Christi
        );
        
        return feriadosMovel.contains(data);
    }
    
    /**
     * Calcula a data da Páscoa para um determinado ano
     * Algoritmo de Gauss
     */
    private LocalDate calcularPascoa(int ano) {
        int a = ano % 19;
        int b = ano / 100;
        int c = ano % 100;
        int d = b / 4;
        int e = b % 4;
        int f = (b + 8) / 25;
        int g = (b - f + 1) / 3;
        int h = (19 * a + b - d - g + 15) % 30;
        int i = c / 4;
        int k = c % 4;
        int l = (32 + 2 * e + 2 * i - h - k) % 7;
        int m = (a + 11 * h + 22 * l) / 451;
        int n = (h + l - 7 * m + 114) / 31;
        int p = (h + l - 7 * m + 114) % 31;
        
        return LocalDate.of(ano, n, p + 1);
    }
    
    /**
     * Busca feriados de um ano específico via API externa
     */
    public void carregarFeriadosAno(int ano) {
        try {
            // Log removido temporariamente
            
            // Simulação de chamada para API de feriados
            // Em produção, usar uma API real como a do IBGE ou similar
            
        } catch (Exception e) {
            System.out.println("Erro ao carregar feriados para o ano {}: " + ano, e.getMessage());
        }
    }
    
    /**
     * Verifica se uma data é dia útil (não é fim de semana nem feriado)
     */
    public boolean isDiaUtil(LocalDate data) {
        DayOfWeek diaSemana = data.getDayOfWeek();
        return diaSemana != DayOfWeek.SATURDAY && 
               diaSemana != DayOfWeek.SUNDAY && 
               !isFeriado(data);
    }
    
    /**
     * Calcula o próximo dia útil a partir de uma data
     */
    public LocalDate proximoDiaUtil(LocalDate data) {
        LocalDate proximaData = data.plusDays(1);
        
        while (!isDiaUtil(proximaData)) {
            proximaData = proximaData.plusDays(1);
        }
        
        return proximaData;
    }
    
    /**
     * Calcula quantos dias úteis existem entre duas datas
     */
    public long calcularDiasUteis(LocalDate dataInicio, LocalDate dataFim) {
        long diasUteis = 0;
        LocalDate dataAtual = dataInicio;
        
        while (!dataAtual.isAfter(dataFim)) {
            if (isDiaUtil(dataAtual)) {
                diasUteis++;
            }
            dataAtual = dataAtual.plusDays(1);
        }
        
        return diasUteis;
    }
}


