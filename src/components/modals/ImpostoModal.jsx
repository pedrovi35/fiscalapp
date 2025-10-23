import React from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Settings, AlertCircle, Clock, Building2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Label, Textarea, Select } from '../ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export default function ImpostoModal({ open, onOpenChange, imposto, onSave }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: imposto || {
      nome: '',
      codigo: '',
      tipo: 'FEDERAL',
      descricao: '',
      tipoRecorrencia: 'MENSAL',
      diaVencimento: 1,
      mesVencimento: null,
      ajustarFinaisSemana: true,
      ajustarFeriados: true,
      prazoAntecedenciaDias: 7,
      ativo: true
    }
  })

  const tipoRecorrencia = watch('tipoRecorrencia')

  const tiposImposto = [
    { value: 'FEDERAL', label: 'Federal' },
    { value: 'ESTADUAL', label: 'Estadual' },
    { value: 'MUNICIPAL', label: 'Municipal' },
    { value: 'CONTRIBUIÇÃO', label: 'Contribuição' },
    { value: 'TAXA', label: 'Taxa' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  const tiposRecorrencia = [
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'BIMESTRAL', label: 'Bimestral' },
    { value: 'TRIMESTRAL', label: 'Trimestral' },
    { value: 'SEMESTRAL', label: 'Semestral' },
    { value: 'ANUAL', label: 'Anual' },
    { value: 'PERSONALIZADA', label: 'Personalizada' }
  ]

  const onSubmit = (data) => {
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="gradient-navy text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {imposto ? 'Editar Imposto' : 'Novo Imposto'}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {imposto ? 'Atualize as informações do imposto' : 'Configure um novo imposto ou tributo'}
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
                        <Label htmlFor="nome">Nome do Imposto *</Label>
                        <Input
                          id="nome"
                          {...register('nome', { required: 'Nome é obrigatório' })}
                          placeholder="Ex: ICMS, IPI, ISS"
                        />
                        {errors.nome && (
                          <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="codigo">Código</Label>
                        <Input
                          id="codigo"
                          {...register('codigo')}
                          placeholder="Ex: ICMS, IPI"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tipo">Tipo do Imposto *</Label>
                      <Select
                        id="tipo"
                        {...register('tipo', { required: 'Tipo é obrigatório' })}
                      >
                        {tiposImposto.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </Select>
                      {errors.tipo && (
                        <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        {...register('descricao')}
                        placeholder="Descrição detalhada do imposto..."
                        rows={3}
                      />
                    </div>
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
                    
                    {tipoRecorrencia === 'ANUAL' && (
                      <div>
                        <Label htmlFor="mesVencimento">Mês do Vencimento</Label>
                        <Select id="mesVencimento" {...register('mesVencimento')}>
                          <option value="">Selecione o mês</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {new Date(2024, i).toLocaleString('pt-BR', { month: 'long' })}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Configurações Avançadas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Configurações Avançadas
                    </h3>
                    
                    <div>
                      <Label htmlFor="prazoAntecedenciaDias">Prazo de Antecedência (dias)</Label>
                      <Input
                        id="prazoAntecedenciaDias"
                        type="number"
                        min="1"
                        max="30"
                        {...register('prazoAntecedenciaDias', {
                          min: { value: 1, message: 'Mínimo 1 dia' },
                          max: { value: 30, message: 'Máximo 30 dias' }
                        })}
                      />
                      {errors.prazoAntecedenciaDias && (
                        <p className="text-sm text-red-500 mt-1">{errors.prazoAntecedenciaDias.message}</p>
                      )}
                    </div>
                    
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
                          Imposto ativo
                        </Label>
                      </div>
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
                      {imposto ? 'Atualizar' : 'Criar'} Imposto
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
