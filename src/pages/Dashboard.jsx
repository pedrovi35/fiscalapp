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
import { LoadingSpinner, LoadingGrid } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
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
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Críticas',
      value: estatisticas.criticas,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      description: '≤ 3 dias para vencer',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Urgentes',
      value: estatisticas.urgentes,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      description: '≤ 7 dias para vencer',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Concluídas',
      value: estatisticas.concluidas,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: 'Obrigações finalizadas',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Loading */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Loading */}
        <LoadingGrid count={4} />

        {/* Content Loading */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <LoadingGrid count={2} />
          </div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <LoadingGrid count={2} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das obrigações fiscais
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



