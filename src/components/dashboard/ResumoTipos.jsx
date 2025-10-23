import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { utils } from '../../services/api'

export default function ResumoTipos() {
  const { obrigacoes } = useApp()

  // Calcular resumo por tipos
  const resumoTipos = obrigacoes.reduce((acc, obrigacao) => {
    const tipo = obrigacao.tipo
    if (!acc[tipo]) {
      acc[tipo] = {
        nome: utils.getNomeTipo(tipo),
        cor: utils.getCorTipo(tipo),
        count: 0,
        concluidas: 0
      }
    }
    acc[tipo].count++
    if (obrigacao.concluida) {
      acc[tipo].concluidas++
    }
    return acc
  }, {})

  const tipos = Object.entries(resumoTipos).sort((a, b) => b[1].count - a[1].count)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Tipo</CardTitle>
        <CardDescription>
          Distribuição das obrigações por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tipos.map(([tipo, data], index) => (
            <motion.div
              key={tipo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.cor }}
                />
                <div>
                  <p className="font-medium">{data.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.concluidas} de {data.count} concluídas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{data.count}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((data.concluidas / data.count) * 100)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {tipos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma obrigação cadastrada
            </p>
          </div>
        )}

        {/* Barra de progresso geral */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso Geral</span>
            <span>
              {obrigacoes.length > 0 
                ? Math.round((obrigacoes.filter(o => o.concluida).length / obrigacoes.length) * 100)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: obrigacoes.length > 0 
                  ? `${(obrigacoes.filter(o => o.concluida).length / obrigacoes.length) * 100}%`
                  : '0%'
              }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}






