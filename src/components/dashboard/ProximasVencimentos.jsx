import React from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { utils } from '../../services/api'

export default function ProximasVencimentos() {
  const { proximasVencimentos } = useApp()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VENCIDA':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'CRÍTICA':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'URGENTE':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
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

  if (proximasVencimentos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Vencimentos
          </CardTitle>
          <CardDescription>
            Obrigações que vencem nos próximos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma obrigação próxima do vencimento
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Próximas Vencimentos
        </CardTitle>
        <CardDescription>
          Obrigações que vencem nos próximos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {proximasVencimentos.map((obrigacao, index) => (
            <motion.div
              key={obrigacao.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(obrigacao.statusUrgencia)}
                <div>
                  <h4 className="font-medium">{obrigacao.nome}</h4>
                  <p className="text-sm text-muted-foreground">
                    {obrigacao.cliente?.nome || 'Sem cliente'} • {obrigacao.responsavel?.nome || 'Sem responsável'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(obrigacao.statusUrgencia)}
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {obrigacao.diasParaVencimento} dias
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {utils.formatarData(obrigacao.dataVencimento)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            Ver todas as obrigações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}






