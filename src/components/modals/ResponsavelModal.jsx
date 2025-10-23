import React from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users } from 'lucide-react'
import { useCreateResponsavel, useUpdateResponsavel } from '../../hooks/useApi'
import { Button } from '../ui/Button'
import { Input, Label, Textarea } from '../ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

export default function ResponsavelModal({ open, onOpenChange, responsavel }) {
  const createResponsavel = useCreateResponsavel()
  const updateResponsavel = useUpdateResponsavel()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nome: responsavel?.nome || '',
      email: responsavel?.email || '',
      telefone: responsavel?.telefone || '',
      cargo: responsavel?.cargo || '',
      departamento: responsavel?.departamento || '',
      observacoes: responsavel?.observacoes || '',
    }
  })

  const onSubmit = async (data) => {
    try {
      if (responsavel) {
        await updateResponsavel.mutateAsync({ id: responsavel.id, data })
      } else {
        await createResponsavel.mutateAsync(data)
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar responsável:', error)
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {responsavel ? 'Editar Responsável' : 'Novo Responsável'}
                  </CardTitle>
                  <CardDescription>
                    {responsavel ? 'Atualize os dados do responsável' : 'Preencha os dados do novo responsável'}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      placeholder="Ex: João Silva"
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500">{errors.nome.message}</p>
                    )}
                  </div>

                  {/* Contato */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="joao@empresa.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        {...register('telefone')}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  {/* Cargo e Departamento */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        {...register('cargo')}
                        placeholder="Ex: Contador"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        {...register('departamento')}
                        placeholder="Ex: Financeiro"
                      />
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      {...register('observacoes')}
                      placeholder="Informações adicionais sobre o responsável..."
                      rows={3}
                    />
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
                          <Users className="h-4 w-4 mr-2" />
                          {responsavel ? 'Atualizar' : 'Salvar'}
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






