import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Plus, Filter, Eye, EyeOff } from 'lucide-react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useApp } from '../contexts/AppContext'
import { useObrigacoes, useClientes, useResponsaveis } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input, Label, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { utils } from '../services/api'
import ObrigacaoModal from '../components/modals/ObrigacaoModal'

const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const { filtros, setFiltros, clearFiltros } = useApp()
  const { data: obrigacoes = [], isLoading } = useObrigacoes()
  const { data: clientes = [] } = useClientes()
  const { data: responsaveis = [] } = useResponsaveis()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false)
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  // Filtrar obrigações
  const obrigacoesFiltradas = useMemo(() => {
    return obrigacoes.filter(obrigacao => {
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
      return true
    })
  }, [obrigacoes, filtros])

  // Converter obrigações para eventos do calendário
  const eventos = useMemo(() => {
    return obrigacoesFiltradas.map(obrigacao => ({
      id: obrigacao.id,
      title: obrigacao.nome,
      start: new Date(obrigacao.dataVencimento),
      end: new Date(obrigacao.dataVencimento),
      resource: obrigacao,
      style: {
        backgroundColor: utils.getCorTipo(obrigacao.tipo),
        color: obrigacao.tipo === 'PARCELAMENTO' ? '#000' : '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
      }
    }))
  }, [obrigacoesFiltradas])

  const handleSelectEvent = (event) => {
    console.log('Evento selecionado:', event.resource)
    // Aqui você pode abrir um modal com detalhes da obrigação
  }

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot selecionado:', slotInfo)
    // Aqui você pode abrir o modal para criar obrigação na data selecionada
    setModalOpen(true)
  }

  const aplicarFiltros = (novosFiltros) => {
    setFiltros(novosFiltros)
  }

  const limparFiltros = () => {
    clearFiltros()
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
            <CalendarIcon className="h-8 w-8" />
            Calendário
          </h1>
          <p className="text-muted-foreground">
            Visualize suas obrigações fiscais no calendário
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
          >
            {filtrosVisiveis ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {filtrosVisiveis ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Obrigação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {filtrosVisiveis && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Filtre as obrigações exibidas no calendário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="filtroCliente">Cliente</Label>
                  <Select
                    id="filtroCliente"
                    value={filtros.clienteId}
                    onChange={(e) => aplicarFiltros({ clienteId: e.target.value })}
                  >
                    <option value="">Todos os clientes</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filtroResponsavel">Responsável</Label>
                  <Select
                    id="filtroResponsavel"
                    value={filtros.responsavelId}
                    onChange={(e) => aplicarFiltros({ responsavelId: e.target.value })}
                  >
                    <option value="">Todos os responsáveis</option>
                    {responsaveis.map(responsavel => (
                      <option key={responsavel.id} value={responsavel.id}>
                        {responsavel.nome}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filtroTipo">Tipo</Label>
                  <Select
                    id="filtroTipo"
                    value={filtros.tipo}
                    onChange={(e) => aplicarFiltros({ tipo: e.target.value })}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="IMPOSTO">Imposto</option>
                    <option value="PARCELAMENTO">Parcelamento</option>
                    <option value="DECLARACAO">Declaração</option>
                    <option value="DOCUMENTO">Documento</option>
                    <option value="OUTROS">Outros</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filtroStatus">Status</Label>
                  <Select
                    id="filtroStatus"
                    value={filtros.status}
                    onChange={(e) => aplicarFiltros({ status: e.target.value })}
                  >
                    <option value="">Todos os status</option>
                    <option value="false">Pendentes</option>
                    <option value="true">Concluídas</option>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={limparFiltros}>
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Calendário */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              popup
              messages={{
                next: 'Próximo',
                previous: 'Anterior',
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                agenda: 'Agenda',
                date: 'Data',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'Nenhuma obrigação neste período',
                showMore: (total) => `+${total} mais`
              }}
              eventPropGetter={(event) => ({
                style: event.style
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {['IMPOSTO', 'PARCELAMENTO', 'DECLARACAO', 'DOCUMENTO', 'OUTROS'].map(tipo => (
              <div key={tipo} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: utils.getCorTipo(tipo) }}
                />
                <span className="text-sm">{utils.getNomeTipo(tipo)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Nova Obrigação */}
      <ObrigacaoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  )
}



