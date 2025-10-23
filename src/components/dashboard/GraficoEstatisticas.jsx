import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { utils } from '../../services/api'

export default function GraficoEstatisticas() {
  const { estatisticas, obrigacoes } = useApp()

  // Dados para gráfico de barras - obrigações por mês
  const dadosMensais = React.useMemo(() => {
    const meses = {}
    obrigacoes.forEach(obrigacao => {
      const mes = new Date(obrigacao.dataVencimento).toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      })
      if (!meses[mes]) {
        meses[mes] = { mes, total: 0, concluidas: 0 }
      }
      meses[mes].total++
      if (obrigacao.concluida) {
        meses[mes].concluidas++
      }
    })
    return Object.values(meses).slice(-6) // Últimos 6 meses
  }, [obrigacoes])

  // Dados para gráfico de pizza - status de urgência
  const dadosStatus = [
    { name: 'Vencidas', value: estatisticas.vencidas, color: '#ef4444' },
    { name: 'Críticas', value: estatisticas.criticas, color: '#f97316' },
    { name: 'Urgentes', value: estatisticas.urgentes, color: '#eab308' },
    { name: 'Normais', value: estatisticas.normais, color: '#22c55e' },
  ].filter(item => item.value > 0)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Barras - Obrigações por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Obrigações por Mês</CardTitle>
          <CardDescription>
            Evolução das obrigações nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" />
                <Bar dataKey="concluidas" fill="hsl(var(--primary))" fillOpacity={0.6} name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Status de Urgência */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Urgência</CardTitle>
          <CardDescription>
            Distribuição por nível de urgência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






