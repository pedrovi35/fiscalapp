import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { List, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, CheckCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useObrigacoes, useMarcarConcluida, useDeleteObrigacao } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input, Label, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { utils } from '../services/api'
import ObrigacaoModal from '../components/modals/ObrigacaoModal'

export default function Obrigacoes() {
  const { filtros, setFiltros, clearFiltros } = useApp()
  const { data: obrigacoes = [], isLoading } = useObrigacoes()
  const marcarConcluida = useMarcarConcluida()
  const deleteObrigacao = useDeleteObrigacao()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('dataVencimento')
  const [sortOrder, setSortOrder] = useState('asc')

  // Filtrar e ordenar obrigações
  const obrigacoesFiltradas = React.useMemo(() => {
    let filtered = obrigacoes.filter(obrigacao => {
      // Filtros do contexto
      if (filtros.clienteId && obrigacao.cliente?.id !== parseInt(filtros.clienteId)) {
        return false
      }
      if (filtros.responsavelId && obrigacao.responsavel?.id !== parseInt(filtros.responsavelId)) {
        return false
      }
      if (filtros.tipo && obrigacao.tipo !== filtros.tipo) {
        return false
      }
      if (filtros.status !== '' && obrigacao.concluida !== (filtros.status === 'true')) {
        return false
      }
      
      // Busca por texto
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          obrigacao.nome.toLowerCase().includes(term) ||
          obrigacao.descricao?.toLowerCase().includes(term) ||
          obrigacao.cliente?.nome.toLowerCase().includes(term) ||
          obrigacao.responsavel?.nome.toLowerCase().includes(term)
        )
      }
      
      return true
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'nome':
          aValue = a.nome.toLowerCase()
          bValue = b.nome.toLowerCase()
          break
        case 'dataVencimento':
          aValue = new Date(a.dataVencimento)
          bValue = new Date(b.dataVencimento)
          break
        case 'tipo':
          aValue = a.tipo
          bValue = b.tipo
          break
        case 'statusUrgencia':
          const order = ['VENCIDA', 'CRÍTICA', 'URGENTE', 'ATENÇÃO', 'NORMAL']
          aValue = order.indexOf(a.statusUrgencia)
          bValue = order.indexOf(b.statusUrgencia)
          break
        default:
          aValue = a[sortBy]
          bValue = b[sortBy]
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [obrigacoes, filtros, searchTerm, sortBy, sortOrder])

  const handleMarcarConcluida = async (id) => {
    try {
      await marcarConcluida.mutateAsync(id)
    } catch (error) {
      console.error('Erro ao marcar como concluída:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta obrigação?')) {
      try {
        await deleteObrigacao.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir obrigação:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'VENCIDA': 'destructive',
      'CRÍTICA': 'destructive',
      'URGENTE': 'secondary',
      'ATENÇÃO': 'secondary',
      'NORMAL': 'default'
    }
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    )
  }

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <List className="h-8 w-8" />
            Obrigações
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas obrigações fiscais
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Obrigação
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Nome, cliente, responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortBy">Ordenar por</Label>
              <Select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dataVencimento">Data de Vencimento</option>
                <option value="nome">Nome</option>
                <option value="tipo">Tipo</option>
                <option value="statusUrgencia">Status de Urgência</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={filtros.status}
                onChange={(e) => setFiltros({ status: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="false">Pendentes</option>
                <option value="true">Concluídas</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={clearFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Obrigações */}
      <div className="grid gap-4">
        {obrigacoesFiltradas.map((obrigacao, index) => (
          <motion.div
            key={obrigacao.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`${obrigacao.concluida ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{obrigacao.nome}</h3>
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: utils.getCorTipo(obrigacao.tipo),
                          color: obrigacao.tipo === 'PARCELAMENTO' ? '#000' : '#fff'
                        }}
                      >
                        {utils.getNomeTipo(obrigacao.tipo)}
                      </Badge>
                      {getStatusBadge(obrigacao.statusUrgencia)}
                      {obrigacao.concluida && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                    
                    {obrigacao.descricao && (
                      <p className="text-muted-foreground mb-3">{obrigacao.descricao}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>Cliente:</span>
                        <span className="font-medium">
                          {obrigacao.cliente?.nome || 'Não definido'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Responsável:</span>
                        <span className="font-medium">
                          {obrigacao.responsavel?.nome || 'Não definido'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Vencimento:</span>
                        <span className="font-medium">
                          {utils.formatarData(obrigacao.dataVencimento)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Dias restantes:</span>
                        <span className="font-medium">
                          {obrigacao.diasParaVencimento}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!obrigacao.concluida && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarcarConcluida(obrigacao.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Concluir
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(obrigacao.id)}
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

      {obrigacoesFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma obrigação encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou criar uma nova obrigação
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Obrigação
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Nova Obrigação */}
      <ObrigacaoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  )
}



