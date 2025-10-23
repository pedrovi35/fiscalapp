import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Plus,
  Filter
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useObrigacoes, useEstatisticas } from '../hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { utils } from '../services/api'
import ObrigacaoModal from '../components/modals/ObrigacaoModal'
import StatsCard from '../components/dashboard/StatsCard'
import ProximasVencimentos from '../components/dashboard/ProximasVencimentos'
import ResumoTipos from '../components/dashboard/ResumoTipos'
import GraficoEstatisticas from '../components/dashboard/GraficoEstatisticas'

export default function Dashboard() {
  const { estatisticas, proximasVencimentos, toggleTheme, theme } = useApp()
  const { data: obrigacoes, isLoading } = useObrigacoes()
  const { data: estatisticasApi } = useEstatisticas()
  const [modalOpen, setModalOpen] = React.useState(false)

  const stats = [
    {
      title: 'Vencidas',
      value: estatisticas.vencidas,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'Obrigações em atraso',
    },
    {
      title: 'Críticas',
      value: estatisticas.criticas,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      description: '≤ 3 dias para vencer',
    },
    {
      title: 'Urgentes',
      value: estatisticas.urgentes,
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      description: '≤ 7 dias para vencer',
    },
    {
      title: 'Concluídas',
      value: estatisticas.concluidas,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: 'Obrigações finalizadas',
    },
  ]

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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das obrigações fiscais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Obrigação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Próximas Vencimentos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ProximasVencimentos />
        </motion.div>

        {/* Resumo por Tipos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ResumoTipos />
        </motion.div>
      </div>

      {/* Gráfico de Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GraficoEstatisticas />
      </motion.div>

      {/* Modal Nova Obrigação */}
      <ObrigacaoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  )
}



