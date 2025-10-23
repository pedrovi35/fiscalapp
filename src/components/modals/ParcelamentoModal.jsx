import React from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Settings, AlertCircle, Clock, Building2, DollarSign, Percent } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Label, Textarea, Select } from '../ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export default function ParcelamentoModal({ open, onOpenChange, parcelamento, onSave }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: parcelamento || {
      nome: '',
      descricao: '',
      cliente: null,
      responsavel: null,
      valorTotal: 0,
      numeroParcelas: 1,
      parcelaAtual: 1,
      valorParcela: 0,
      dataInicio: '',
      dataFim: '',
      status: 'ATIVO',
      tipoRecorrencia: 'MENSAL',
      diaVencimento: 1,
      ajustarFinaisSemana: true,
      ajustarFeriados: true,
      observacoes: '',
      ativo: true
    }
  })

  const tipoRecorrencia = watch('tipoRecorrencia')
  const valorTotal = watch('valorTotal')
  const numeroParcelas = watch('numeroParcelas')

  const statusParcelamento = [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'SUSPENSO', label: 'Suspenso' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ]

  const tiposRecorrencia = [
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'BIMESTRAL', label: 'Bimestral' },
    { value: 'TRIMESTRAL', label: 'Trimestral' },
    { value: 'SEMESTRAL', label: 'Semestral' },
    { value: 'ANUAL', label: 'Anual' }
  ]

  const onSubmit = (data) => {
    // Calcular valor da parcela automaticamente
    if (data.valorTotal && data.numeroParcelas) {
      data.valorParcela = data.valorTotal / data.numeroParcelas
    }
    
    onSave(data)
    reset()
  }

  const handleClose = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="gradient-navy text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {parcelamento ? 'Editar Parcelamento' : 'Novo Parcelamento'}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {parcelamento ? 'Atualize as informações do parcelamento' : 'Configure um novo parcelamento fiscal'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Informações Básicas
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome do Parcelamento *</Label>
                        <Input
                          id="nome"
                          {...register('nome', { required: 'Nome é obrigatório' })}
                          placeholder="Ex: Parcelamento ICMS 2024"
                        />
                        {errors.nome && (
                          <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select id="status" {...register('status')}>
                          {statusParcelamento.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        {...register('descricao')}
                        placeholder="Descrição detalhada do parcelamento..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Informações Financeiras */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Informações Financeiras
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="valorTotal">Valor Total *</Label>
                        <Input
                          id="valorTotal"
                          type="number"
                          step="0.01"
                          min="0"
                          {...register('valorTotal', { 
                            required: 'Valor total é obrigatório',
                            min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                          })}
                        />
                        {errors.valorTotal && (
                          <p className="text-sm text-red-500 mt-1">{errors.valorTotal.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="numeroParcelas">Número de Parcelas *</Label>
                        <Input
                          id="numeroParcelas"
                          type="number"
                          min="1"
                          max="60"
                          {...register('numeroParcelas', { 
                            required: 'Número de parcelas é obrigatório',
                            min: { value: 1, message: 'Mínimo 1 parcela' },
                            max: { value: 60, message: 'Máximo 60 parcelas' }
                          })}
                        />
                        {errors.numeroParcelas && (
                          <p className="text-sm text-red-500 mt-1">{errors.numeroParcelas.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="parcelaAtual">Parcela Atual</Label>
                        <Input
                          id="parcelaAtual"
                          type="number"
                          min="1"
                          {...register('parcelaAtual', {
                            min: { value: 1, message: 'Mínimo 1' }
                          })}
                        />
                        {errors.parcelaAtual && (
                          <p className="text-sm text-red-500 mt-1">{errors.parcelaAtual.message}</p>
                        )}
                      </div>
                    </div>
                    
                    {valorTotal && numeroParcelas && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Valor por parcela:</strong> R$ {(valorTotal / numeroParcelas).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Configurações de Recorrência */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Configurações de Recorrência
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipoRecorrencia">Tipo de Recorrência *</Label>
                        <Select
                          id="tipoRecorrencia"
                          {...register('tipoRecorrencia', { required: 'Tipo de recorrência é obrigatório' })}
                        >
                          {tiposRecorrencia.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </option>
                          ))}
                        </Select>
                        {errors.tipoRecorrencia && (
                          <p className="text-sm text-red-500 mt-1">{errors.tipoRecorrencia.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="diaVencimento">Dia do Vencimento *</Label>
                        <Input
                          id="diaVencimento"
                          type="number"
                          min="1"
                          max="31"
                          {...register('diaVencimento', { 
                            required: 'Dia de vencimento é obrigatório',
                            min: { value: 1, message: 'Mínimo 1' },
                            max: { value: 31, message: 'Máximo 31' }
                          })}
                        />
                        {errors.diaVencimento && (
                          <p className="text-sm text-red-500 mt-1">{errors.diaVencimento.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dataInicio">Data de Início *</Label>
                        <Input
                          id="dataInicio"
                          type="date"
                          {...register('dataInicio', { required: 'Data de início é obrigatória' })}
                        />
                        {errors.dataInicio && (
                          <p className="text-sm text-red-500 mt-1">{errors.dataInicio.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="dataFim">Data de Fim</Label>
                        <Input
                          id="dataFim"
                          type="date"
                          {...register('dataFim')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configurações Avançadas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Configurações Avançadas
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ajustarFinaisSemana"
                          {...register('ajustarFinaisSemana')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="ajustarFinaisSemana" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Ajustar automaticamente para fins de semana
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ajustarFeriados"
                          {...register('ajustarFeriados')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="ajustarFeriados" className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Ajustar automaticamente para feriados
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ativo"
                          {...register('ativo')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="ativo" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Parcelamento ativo
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        {...register('observacoes')}
                        placeholder="Observações adicionais sobre o parcelamento..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="gradient-navy hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
                    >
                      {parcelamento ? 'Atualizar' : 'Criar'} Parcelamento
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
