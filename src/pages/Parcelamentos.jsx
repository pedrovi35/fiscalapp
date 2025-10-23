import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Percent
} from 'lucide-react'
import { useNotificacao } from '../contexts/NotificacaoContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import ParcelamentoModal from '../components/modals/ParcelamentoModal'

export default function Parcelamentos() {
  const [parcelamentos, setParcelamentos] = useState([])
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    cliente: ''
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [parcelamentoEditando, setParcelamentoEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const { notificarMudanca, iniciarEdicao, finalizarEdicao } = useNotificacao()

  // Dados mockados para demonstração
  useEffect(() => {
    const parcelamentosMock = [
      {
        id: 1,
        nome: 'Parcelamento ICMS 2024',
        descricao: 'Parcelamento de débitos de ICMS do exercício 2024',
        cliente: { id: 1, nome: 'Empresa ABC Ltda' },
        responsavel: { id: 1, nome: 'João Silva' },
        valorTotal: 50000.00,
        numeroParcelas: 12,
        parcelaAtual: 3,
        valorParcela: 4166.67,
        dataInicio: '2024-01-15',
        dataFim: '2024-12-15',
        status: 'ATIVO',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 15,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        observacoes: 'Parcelamento aprovado pelo estado',
        ativo: true,
        dataCriacao: '2024-01-15T10:00:00',
        ultimoEditor: 'Admin'
      },
      {
        id: 2,
        nome: 'Parcelamento IPI',
        descricao: 'Parcelamento de débitos de IPI',
        cliente: { id: 2, nome: 'Indústria XYZ S/A' },
        responsavel: { id: 2, nome: 'Maria Santos' },
        valorTotal: 25000.00,
        numeroParcelas: 6,
        parcelaAtual: 6,
        valorParcela: 4166.67,
        dataInicio: '2023-07-01',
        dataFim: '2023-12-01',
        status: 'CONCLUIDO',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 1,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        observacoes: 'Parcelamento concluído com sucesso',
        ativo: true,
        dataCriacao: '2023-07-01T14:30:00',
        ultimoEditor: 'Admin'
      },
      {
        id: 3,
        nome: 'Parcelamento ISS',
        descricao: 'Parcelamento de débitos de ISS municipal',
        cliente: { id: 3, nome: 'Comércio DEF Ltda' },
        responsavel: { id: 1, nome: 'João Silva' },
        valorTotal: 15000.00,
        numeroParcelas: 8,
        parcelaAtual: 2,
        valorParcela: 1875.00,
        dataInicio: '2024-02-01',
        dataFim: '2024-09-01',
        status: 'ATIVO',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 10,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        observacoes: 'Parcelamento municipal em andamento',
        ativo: true,
        dataCriacao: '2024-02-01T09:15:00',
        ultimoEditor: 'Admin'
      }
    ]
    
    setTimeout(() => {
      setParcelamentos(parcelamentosMock)
      setLoading(false)
    }, 1000)
  }, [])

  const statusParcelamento = [
    { value: 'ATIVO', label: 'Ativo', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 'CONCLUIDO', label: 'Concluído', color: 'bg-blue-100 text-blue-800', icon: '✅' },
    { value: 'SUSPENSO', label: 'Suspenso', color: 'bg-yellow-100 text-yellow-800', icon: '⏸️' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: '❌' }
  ]

  const tiposRecorrencia = [
    { value: 'MENSAL', label: 'Mensal', icon: '📅' },
    { value: 'BIMESTRAL', label: 'Bimestral', icon: '📆' },
    { value: 'TRIMESTRAL', label: 'Trimestral', icon: '🗓️' },
    { value: 'SEMESTRAL', label: 'Semestral', icon: '📋' },
    { value: 'ANUAL', label: 'Anual', icon: '📊' }
  ]

  const parcelamentosFiltrados = parcelamentos.filter(parcelamento => {
    const matchBusca = !filtros.busca || 
      parcelamento.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      parcelamento.cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase())
    
    const matchStatus = !filtros.status || parcelamento.status === filtros.status
    const matchCliente = !filtros.cliente || parcelamento.cliente.id.toString() === filtros.cliente
    
    return matchBusca && matchStatus && matchCliente
  })

  const handleEditar = (parcelamento) => {
    iniciarEdicao('Parcelamento', parcelamento.id)
    setParcelamentoEditando(parcelamento)
    setModalOpen(true)
  }

  const handleSalvar = (dadosParcelamento) => {
    if (parcelamentoEditando) {
      // Atualizar parcelamento existente
      setParcelamentos(prev => prev.map(parc => 
        parc.id === parcelamentoEditando.id ? { ...parc, ...dadosParcelamento } : parc
      ))
      notificarMudanca('OBRIGACAO_ATUALIZADA', `Parcelamento ${dadosParcelamento.nome} atualizado com sucesso`)
      finalizarEdicao('Parcelamento', parcelamentoEditando.id)
    } else {
      // Criar novo parcelamento
      const novoParcelamento = {
        ...dadosParcelamento,
        id: Date.now(),
        dataCriacao: new Date().toISOString(),
        ultimoEditor: 'Usuário Atual'
      }
      setParcelamentos(prev => [novoParcelamento, ...prev])
      notificarMudanca('OBRIGACAO_CRIADA', `Novo parcelamento ${dadosParcelamento.nome} criado com sucesso`)
    }
    
    setModalOpen(false)
    setParcelamentoEditando(null)
  }

  const handleExcluir = (parcelamento) => {
    if (window.confirm(`Tem certeza que deseja excluir o parcelamento ${parcelamento.nome}?`)) {
      setParcelamentos(prev => prev.filter(parc => parc.id !== parcelamento.id))
      notificarMudanca('OBRIGACAO_EXCLUIDA', `Parcelamento ${parcelamento.nome} excluído`)
    }
  }

  const getStatusInfo = (status) => {
    return statusParcelamento.find(s => s.value === status) || statusParcelamento[0]
  }

  const getRecorrenciaInfo = (tipo) => {
    return tiposRecorrencia.find(t => t.value === tipo) || tiposRecorrencia[0]
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calcularProgresso = (parcelaAtual, numeroParcelas) => {
    return ((parcelaAtual / numeroParcelas) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Parcelamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de parcelamentos fiscais e acompanhamento de progresso
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="gradient-primary hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Parcelamento
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ativo</p>
                <p className="text-2xl font-bold text-green-600">
                  {parcelamentos.filter(p => p.status === 'ATIVO').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {parcelamentos.filter(p => p.status === 'CONCLUIDO').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(parcelamentos.reduce((sum, p) => sum + p.valorTotal, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conclusão</p>
                <p className="text-2xl font-bold text-purple-600">
                  {parcelamentos.length > 0 ? 
                    ((parcelamentos.filter(p => p.status === 'CONCLUIDO').length / parcelamentos.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cliente..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Todos os status</option>
              {statusParcelamento.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Parcelamentos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parcelamentosFiltrados.map((parcelamento, index) => (
          <motion.div
            key={parcelamento.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="hover-lift"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{parcelamento.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      Cliente: {parcelamento.cliente.nome}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusInfo(parcelamento.status).color}>
                    {getStatusInfo(parcelamento.status).icon} {getStatusInfo(parcelamento.status).label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {parcelamento.descricao}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="font-semibold">{formatCurrency(parcelamento.valorTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor Parcela:</span>
                    <span className="font-semibold">{formatCurrency(parcelamento.valorParcela)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso:</span>
                    <span className="font-semibold">
                      {parcelamento.parcelaAtual}/{parcelamento.numeroParcelas} parcelas
                    </span>
                  </div>
                </div>
                
                {/* Barra de Progresso */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso</span>
                    <span>{calcularProgresso(parcelamento.parcelaAtual, parcelamento.numeroParcelas)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calcularProgresso(parcelamento.parcelaAtual, parcelamento.numeroParcelas)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Vencimento: dia {parcelamento.diaVencimento}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getRecorrenciaInfo(parcelamento.tipoRecorrencia).icon} {getRecorrenciaInfo(parcelamento.tipoRecorrencia).label}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {parcelamento.ativo ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {parcelamento.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditar(parcelamento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluir(parcelamento)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <ParcelamentoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parcelamento={parcelamentoEditando}
        onSave={handleSalvar}
      />
    </div>
  )
}
