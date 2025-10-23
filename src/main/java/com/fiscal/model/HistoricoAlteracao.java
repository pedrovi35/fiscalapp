package com.fiscal.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidade HistoricoAlteracao - Para rastrear mudanças nas obrigações
 * Padrão: Entity Pattern + Audit Pattern
 */
@Entity
@Table(name = "historico_alteracoes")
public class HistoricoAlteracao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obrigacao_id", nullable = false)
    private Obrigacao obrigacao;
    
    @Column(name = "campo_alterado", nullable = false, length = 100)
    private String campoAlterado;
    
    @Column(name = "valor_anterior", length = 1000)
    private String valorAnterior;
    
    @Column(name = "valor_novo", length = 1000)
    private String valorNovo;
    
    @Column(name = "usuario_editor", length = 255)
    private String usuarioEditor;
    
    @Column(name = "ip_usuario", length = 45)
    private String ipUsuario;
    
    @CreationTimestamp
    @Column(name = "data_alteracao", nullable = false, updatable = false)
    private LocalDateTime dataAlteracao;
    
    @Column(name = "observacoes", length = 500)
    private String observacoes;
    
    // Construtores
    public HistoricoAlteracao() {}
    
    public HistoricoAlteracao(Long id, Obrigacao obrigacao, String campoAlterado, String valorAnterior, 
                             String valorNovo, String usuarioEditor, String ipUsuario, 
                             LocalDateTime dataAlteracao, String observacoes) {
        this.id = id;
        this.obrigacao = obrigacao;
        this.campoAlterado = campoAlterado;
        this.valorAnterior = valorAnterior;
        this.valorNovo = valorNovo;
        this.usuarioEditor = usuarioEditor;
        this.ipUsuario = ipUsuario;
        this.dataAlteracao = dataAlteracao;
        this.observacoes = observacoes;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Obrigacao getObrigacao() { return obrigacao; }
    public void setObrigacao(Obrigacao obrigacao) { this.obrigacao = obrigacao; }
    
    public String getCampoAlterado() { return campoAlterado; }
    public void setCampoAlterado(String campoAlterado) { this.campoAlterado = campoAlterado; }
    
    public String getValorAnterior() { return valorAnterior; }
    public void setValorAnterior(String valorAnterior) { this.valorAnterior = valorAnterior; }
    
    public String getValorNovo() { return valorNovo; }
    public void setValorNovo(String valorNovo) { this.valorNovo = valorNovo; }
    
    public String getUsuarioEditor() { return usuarioEditor; }
    public void setUsuarioEditor(String usuarioEditor) { this.usuarioEditor = usuarioEditor; }
    
    public String getIpUsuario() { return ipUsuario; }
    public void setIpUsuario(String ipUsuario) { this.ipUsuario = ipUsuario; }
    
    public LocalDateTime getDataAlteracao() { return dataAlteracao; }
    public void setDataAlteracao(LocalDateTime dataAlteracao) { this.dataAlteracao = dataAlteracao; }
    
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}


