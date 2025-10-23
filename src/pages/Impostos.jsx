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
  Building2,
  Settings
} from 'lucide-react'
import { useNotificacao } from '../contexts/NotificacaoContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import ImpostoModal from '../components/modals/ImpostoModal'

export default function Impostos() {
  const [impostos, setImpostos] = useState([])
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: '',
    status: ''
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [impostoEditando, setImpostoEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const { notificarMudanca, iniciarEdicao, finalizarEdicao } = useNotificacao()

  // Dados mockados para demonstração
  useEffect(() => {
    const impostosMock = [
      {
        id: 1,
        nome: 'ICMS',
        codigo: 'ICMS',
        tipo: 'ESTADUAL',
        descricao: 'Imposto sobre Circulação de Mercadorias e Serviços',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 15,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        prazoAntecedenciaDias: 7,
        ativo: true,
        dataCriacao: '2024-01-15T10:00:00',
        ultimoEditor: 'Admin'
      },
      {
        id: 2,
        nome: 'IPI',
        codigo: 'IPI',
        tipo: 'FEDERAL',
        descricao: 'Imposto sobre Produtos Industrializados',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 25,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        prazoAntecedenciaDias: 5,
        ativo: true,
        dataCriacao: '2024-01-20T14:30:00',
        ultimoEditor: 'Admin'
      },
      {
        id: 3,
        nome: 'ISS',
        codigo: 'ISS',
        tipo: 'MUNICIPAL',
        descricao: 'Imposto sobre Serviços',
        tipoRecorrencia: 'MENSAL',
        diaVencimento: 10,
        ajustarFinaisSemana: true,
        ajustarFeriados: true,
        prazoAntecedenciaDias: 3,
        ativo: true,
        dataCriacao: '2024-02-01T09:15:00',
        ultimoEditor: 'Admin'
      }
    ]
    
    setTimeout(() => {
      setImpostos(impostosMock)
      setLoading(false)
    }, 1000)
  }, [])

  const tiposImposto = [
    { value: 'FEDERAL', label: 'Federal', color: 'bg-blue-100 text-blue-800' },
    { value: 'ESTADUAL', label: 'Estadual', color: 'bg-green-100 text-green-800' },
    { value: 'MUNICIPAL', label: 'Municipal', color: 'bg-purple-100 text-purple-800' },
    { value: 'CONTRIBUIÇÃO', label: 'Contribuição', color: 'bg-orange-100 text-orange-800' },
    { value: 'TAXA', label: 'Taxa', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'OUTROS', label: 'Outros', color: 'bg-gray-100 text-gray-800' }
  ]

  const tiposRecorrencia = [
    { value: 'MENSAL', label: 'Mensal', icon: '📅' },
    { value: 'BIMESTRAL', label: 'Bimestral', icon: '📆' },
    { value: 'TRIMESTRAL', label: 'Trimestral', icon: '🗓️' },
    { value: 'SEMESTRAL', label: 'Semestral', icon: '📋' },
    { value: 'ANUAL', label: 'Anual', icon: '📊' },
    { value: 'PERSONALIZADA', label: 'Personalizada', icon: '⚙️' }
  ]

  const impostosFiltrados = impostos.filter(imposto => {
    const matchBusca = !filtros.busca || 
      impostos.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      impostos.codigo.toLowerCase().includes(filtros.busca.toLowerCase())
    
    const matchTipo = !filtros.tipo || impostos.tipo === filtros.tipo
    const matchStatus = !filtros.status || (filtros.status === 'ativo' ? impostos.ativo : !impostos.ativo)
    
    return matchBusca && matchTipo && matchStatus
  })

  const handleEditar = (imposto) => {
    iniciarEdicao('Imposto', impostos.id)
    setImpostoEditando(imposto)
    setModalOpen(true)
  }

  const handleSalvar = (dadosImposto) => {
    if (impostoEditando) {
      // Atualizar imposto existente
      setImpostos(prev => prev.map(imp => 
        imp.id === impostosEditando.id ? { ...imp, ...dadosImposto } : imp
      ))
      notificarMudanca('OBRIGACAO_ATUALIZADA', `Imposto ${dadosImposto.nome} atualizado com sucesso`)
      finalizarEdicao('Imposto', impostosEditando.id)
    } else {
      // Criar novo imposto
      const novoImposto = {
        ...dadosImposto,
        id: Date.now(),
        dataCriacao: new Date().toISOString(),
        ultimoEditor: 'Usuário Atual'
      }
      setImpostos(prev => [novoImposto, ...prev])
      notificarMudanca('OBRIGACAO_CRIADA', `Novo imposto ${dadosImposto.nome} criado com sucesso`)
    }
    
    setModalOpen(false)
    setImpostoEditando(null)
  }

  const handleExcluir = (imposto) => {
    if (window.confirm(`Tem certeza que deseja excluir o imposto ${impostos.nome}?`)) {
      setImpostos(prev => prev.filter(imp => imp.id !== impostos.id))
      notificarMudanca('OBRIGACAO_EXCLUIDA', `Imposto ${impostos.nome} excluído`)
    }
  }

  const getTipoInfo = (tipo) => {
    return tiposImposto.find(t => t.value === tipo) || tiposImposto[5]
  }

  const getRecorrenciaInfo = (tipo) => {
    return tiposRecorrencia.find(t => t.value === tipo) || tiposRecorrencia[0]
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Impostos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de impostos e tributos fiscais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="gradient-navy hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Imposto
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Todos os tipos</option>
              {tiposImposto.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Impostos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {impostosFiltrados.map((imposto, index) => (
          <motion.div
            key={impostos.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="hover-lift"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{impostos.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      Código: {impostos.codigo}
                    </CardDescription>
                  </div>
                  <Badge className={getTipoInfo(impostos.tipo).color}>
                    {getTipoInfo(impostos.tipo).label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {impostos.descricao}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Recorrência:</span>
                  <span className="flex items-center gap-1">
                    {getRecorrenciaInfo(impostos.tipoRecorrencia).icon}
                    {getRecorrenciaInfo(impostos.tipoRecorrencia).label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Vencimento: dia {impostos.diaVencimento}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Antecedência: {impostos.prazoAntecedenciaDias} dias</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  {impostos.ajustarFinaisSemana && (
                    <Badge variant="outline" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Finais de semana
                    </Badge>
                  )}
                  {impostos.ajustarFeriados && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Feriados
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {impostos.ativo ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {impostos.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditar(imposto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExcluir(imposto)}
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
      <ImpostoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        imposto={impostoEditando}
        onSave={handleSalvar}
      />
    </div>
  )
}
