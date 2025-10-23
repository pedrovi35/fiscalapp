import React from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Building2, User, FileText, Clock } from 'lucide-react'
import { useCreateObrigacao } from '../../hooks/useApi'
import { useClientes, useResponsaveis } from '../../hooks/useApi'
import { Button } from '../ui/Button'
import { Input, Label, Textarea, Select } from '../ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export default function ObrigacaoModal({ open, onOpenChange }) {
  const createObrigacao = useCreateObrigacao()
  const { data: clientes = [] } = useClientes()
  const { data: responsaveis = [] } = useResponsaveis()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nome: '',
      tipo: '',
      descricao: '',
      clienteId: '',
      responsavelId: '',
      dataVencimento: '',
      tipoRecorrencia: 'UNICA',
      diaMesRecorrencia: '',
      diasRecorrencia: '',
      ajustarFinaisSemana: true,
      ajustarFeriados: true,
    }
  })

  const tipoRecorrencia = watch('tipoRecorrencia')

  const onSubmit = async (data) => {
    try {
      const obrigacaoData = {
        ...data,
        clienteId: data.clienteId ? parseInt(data.clienteId) : null,
        responsavelId: data.responsavelId ? parseInt(data.responsavelId) : null,
        diaMesRecorrencia: data.diaMesRecorrencia ? parseInt(data.diaMesRecorrencia) : null,
        diasRecorrencia: data.diasRecorrencia ? parseInt(data.diasRecorrencia) : null,
        usuarioEditor: 'Usuário Atual'
      }
      
      await createObrigacao.mutateAsync(obrigacaoData)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar obrigação:', error)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gradient-primary text-white space-y-0 pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Nova Obrigação
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Preencha os dados da nova obrigação fiscal
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da Obrigação *</Label>
                      <Input
                        id="nome"
                        {...register('nome', { required: 'Nome é obrigatório' })}
                        placeholder="Ex: IPTU 2024"
                      />
                      {errors.nome && (
                        <p className="text-sm text-red-500">{errors.nome.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo *</Label>
                      <Select
                        id="tipo"
                        {...register('tipo', { required: 'Tipo é obrigatório' })}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="IMPOSTO">Imposto</option>
                        <option value="PARCELAMENTO">Parcelamento</option>
                        <option value="DECLARACAO">Declaração</option>
                        <option value="DOCUMENTO">Documento</option>
                        <option value="OUTROS">Outros</option>
                      </Select>
                      {errors.tipo && (
                        <p className="text-sm text-red-500">{errors.tipo.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      {...register('descricao')}
                      placeholder="Descrição detalhada da obrigação..."
                      rows={3}
                    />
                  </div>

                  {/* Cliente e Responsável */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clienteId">Cliente</Label>
                      <Select id="clienteId" {...register('clienteId')}>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responsavelId">Responsável</Label>
                      <Select id="responsavelId" {...register('responsavelId')}>
                        <option value="">Selecione um responsável</option>
                        {responsaveis.map(responsavel => (
                          <option key={responsavel.id} value={responsavel.id}>
                            {responsavel.nome}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Data de Vencimento */}
                  <div className="space-y-2">
                    <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                    <Input
                      id="dataVencimento"
                      type="date"
                      {...register('dataVencimento', { required: 'Data de vencimento é obrigatória' })}
                    />
                    {errors.dataVencimento && (
                      <p className="text-sm text-red-500">{errors.dataVencimento.message}</p>
                    )}
                  </div>

                  {/* Recorrência */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoRecorrencia">Tipo de Recorrência</Label>
                      <Select id="tipoRecorrencia" {...register('tipoRecorrencia')}>
                        <option value="UNICA">Única</option>
                        <option value="MENSAL">Mensal</option>
                        <option value="TRIMESTRAL">Trimestral</option>
                        <option value="SEMESTRAL">Semestral</option>
                        <option value="ANUAL">Anual</option>
                        <option value="CUSTOMIZADA">Customizada</option>
                      </Select>
                    </div>

                    {tipoRecorrencia === 'MENSAL' && (
                      <div className="space-y-2">
                        <Label htmlFor="diaMesRecorrencia">Dia do Mês</Label>
                        <Input
                          id="diaMesRecorrencia"
                          type="number"
                          min="1"
                          max="31"
                          {...register('diaMesRecorrencia')}
                          placeholder="Ex: 15"
                        />
                      </div>
                    )}

                    {tipoRecorrencia === 'CUSTOMIZADA' && (
                      <div className="space-y-2">
                        <Label htmlFor="diasRecorrencia">Dias de Recorrência</Label>
                        <Input
                          id="diasRecorrencia"
                          type="number"
                          min="1"
                          {...register('diasRecorrencia')}
                          placeholder="Ex: 30"
                        />
                      </div>
                    )}
                  </div>

                  {/* Opções */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ajustarFinaisSemana"
                        {...register('ajustarFinaisSemana')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="ajustarFinaisSemana">
                        Ajustar fins de semana
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ajustarFeriados"
                        {...register('ajustarFeriados')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="ajustarFeriados">
                        Ajustar feriados
                      </Label>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      )}
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





