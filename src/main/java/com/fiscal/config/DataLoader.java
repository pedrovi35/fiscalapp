package com.fiscal.config;

import com.fiscal.model.*;
import com.fiscal.repository.ClienteRepository;
import com.fiscal.repository.ObrigacaoRepository;
import com.fiscal.repository.ResponsavelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Carregador de dados de exemplo para desenvolvimento
 * Padrão: Command Line Runner Pattern
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {
    
    private final ClienteRepository clienteRepository;
    private final ResponsavelRepository responsavelRepository;
    private final ObrigacaoRepository obrigacaoRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Log removido temporariamente
        
        // Criar clientes de exemplo
        Cliente cliente1 = // Cliente.new 
                .nome("Empresa ABC Ltda")
                .cnpjCpf("12.345.678/0001-90")
                .email("contato@empresaabc.com")
                .telefone("(11) 99999-9999")
                .observacoes("Cliente principal")
                .ativo(true)
                ;
        
        Cliente cliente2 = // Cliente.new 
                .nome("Comércio XYZ S/A")
                .cnpjCpf("98.765.432/0001-10")
                .email("fiscal@comercioxyz.com")
                .telefone("(11) 88888-8888")
                .observacoes("Cliente secundário")
                .ativo(true)
                ;
        
        clienteRepository.save(cliente1);
        clienteRepository.save(cliente2);
        
        // Criar responsáveis de exemplo
        Responsavel responsavel1 = // Responsavel.new 
                .nome("João Silva")
                .email("joao.silva@empresaabc.com")
                .telefone("(11) 99999-1111")
                .cargo("Contador")
                .ativo(true)
                ;
        
        Responsavel responsavel2 = // Responsavel.new 
                .nome("Maria Santos")
                .email("maria.santos@comercioxyz.com")
                .telefone("(11) 88888-2222")
                .cargo("Assistente Fiscal")
                .ativo(true)
                ;
        
        responsavelRepository.save(responsavel1);
        responsavelRepository.save(responsavel2);
        
        // Criar obrigações de exemplo
        Obrigacao obrigacao1 = // Obrigacao.new 
                .nome("DARF Mensal - IRPJ")
                .tipo(TipoObrigacao.IMPOSTO)
                .descricao("Imposto de Renda Pessoa Jurídica mensal")
                .cliente(cliente1)
                .responsavel(responsavel1)
                .dataVencimento(LocalDate.now().plusDays(5))
                .tipoRecorrencia(TipoRecorrencia.MENSAL)
                .diaMesRecorrencia(10)
                .ajustarFinaisSemana(true)
                .ajustarFeriados(true)
                .ativo(true)
                .concluida(false)
                .ultimoEditor("Sistema")
                ;
        
        Obrigacao obrigacao2 = // Obrigacao.new 
                .nome("Parcelamento ICMS")
                .tipo(TipoObrigacao.PARCELAMENTO)
                .descricao("Parcelamento de ICMS em atraso")
                .cliente(cliente2)
                .responsavel(responsavel2)
                .dataVencimento(LocalDate.now().plusDays(2))
                .tipoRecorrencia(TipoRecorrencia.MENSAL)
                .diaMesRecorrencia(15)
                .ajustarFinaisSemana(true)
                .ajustarFeriados(true)
                .ativo(true)
                .concluida(false)
                .ultimoEditor("Sistema")
                ;
        
        Obrigacao obrigacao3 = // Obrigacao.new 
                .nome("SPED Fiscal")
                .tipo(TipoObrigacao.DECLARACAO)
                .descricao("Sistema Público de Escrituração Digital")
                .cliente(cliente1)
                .responsavel(responsavel1)
                .dataVencimento(LocalDate.now().plusDays(10))
                .tipoRecorrencia(TipoRecorrencia.MENSAL)
                .diaMesRecorrencia(25)
                .ajustarFinaisSemana(true)
                .ajustarFeriados(true)
                .ativo(true)
                .concluida(false)
                .ultimoEditor("Sistema")
                ;
        
        Obrigacao obrigacao4 = // Obrigacao.new 
                .nome("DARF Trimestral - CSLL")
                .tipo(TipoObrigacao.IMPOSTO)
                .descricao("Contribuição Social sobre o Lucro Líquido")
                .cliente(cliente2)
                .responsavel(responsavel2)
                .dataVencimento(LocalDate.now().minusDays(3))
                .tipoRecorrencia(TipoRecorrencia.TRIMESTRAL)
                .diaMesRecorrencia(15)
                .ajustarFinaisSemana(true)
                .ajustarFeriados(true)
                .ativo(true)
                .concluida(false)
                .ultimoEditor("Sistema")
                ;
        
        obrigacaoRepository.save(obrigacao1);
        obrigacaoRepository.save(obrigacao2);
        obrigacaoRepository.save(obrigacao3);
        obrigacaoRepository.save(obrigacao4);
        
        // Log removido temporariamente
        System.out.println("- {} clientes criados", clienteRepository.count());
        System.out.println("- {} responsáveis criados", responsavelRepository.count());
        System.out.println("- {} obrigações criadas", obrigacaoRepository.count());
    }
}


