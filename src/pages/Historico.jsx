import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { History, Search, Filter, Calendar, User, FileText } from 'lucide-react'
import { useHistorico } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input, Label, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { utils } from '../services/api'

export default function Historico() {
  const { data: historico = [], isLoading } = useHistorico()
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroUsuario, setFiltroUsuario] = useState('')

  const historicoFiltrado = historico.filter(item => {
    const matchesSearch = 
      item.obrigacao?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = !filtroTipo || item.tipoAlteracao === filtroTipo
    const matchesUsuario = !filtroUsuario || item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())
    
    return matchesSearch && matchesTipo && matchesUsuario
  })

  const getTipoBadge = (tipo) => {
    const variants = {
      'CRIACAO': 'default',
      'ATUALIZACAO': 'secondary',
      'CONCLUSAO': 'default',
      'EXCLUSAO': 'destructive'
    }
    
    const labels = {
      'CRIACAO': 'Criação',
      'ATUALIZACAO': 'Atualização',
      'CONCLUSAO': 'Conclusão',
      'EXCLUSAO': 'Exclusão'
    }
    
    return (
      <Badge variant={variants[tipo] || 'default'}>
        {labels[tipo] || tipo}
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
            <History className="h-8 w-8" />
            Histórico
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todas as alterações realizadas no sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Obrigação, usuário, descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroTipo">Tipo de Alteração</Label>
              <Select
                id="filtroTipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="CRIACAO">Criação</option>
                <option value="ATUALIZACAO">Atualização</option>
                <option value="CONCLUSAO">Conclusão</option>
                <option value="EXCLUSAO">Exclusão</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroUsuario">Usuário</Label>
              <Input
                id="filtroUsuario"
                placeholder="Nome do usuário..."
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <div className="flex gap-2">
                <Input type="date" placeholder="Data início" />
                <Input type="date" placeholder="Data fim" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista do Histórico */}
      <div className="space-y-4">
        {historicoFiltrado.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {item.obrigacao?.nome || 'Obrigação removida'}
                      </h3>
                      {getTipoBadge(item.tipoAlteracao)}
                    </div>
                    
                    {item.descricao && (
                      <p className="text-muted-foreground mb-3">{item.descricao}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{item.usuario}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{utils.formatarDataHora(item.dataAlteracao)}</span>
                      </div>
                      {item.obrigacao && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Tipo: {utils.getNomeTipo(item.obrigacao.tipo)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {historicoFiltrado.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || filtroTipo || filtroUsuario 
                ? 'Tente ajustar os filtros de busca'
                : 'O histórico de alterações aparecerá aqui'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



