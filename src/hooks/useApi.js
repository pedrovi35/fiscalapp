import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { obrigacaoService, clienteService, responsavelService, historicoService } from '../services/api'
import toast from 'react-hot-toast'

// Hook para obrigações
export function useObrigacoes() {
  return useQuery({
    queryKey: ['obrigacoes'],
    queryFn: obrigacaoService.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useObrigacao(id) {
  return useQuery({
    queryKey: ['obrigacao', id],
    queryFn: () => obrigacaoService.getById(id),
    enabled: !!id,
  })
}

export function useCreateObrigacao() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: obrigacaoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['obrigacoes'])
      toast.success('Obrigação criada com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar obrigação')
      console.error(error)
    },
  })
}

export function useUpdateObrigacao() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => obrigacaoService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['obrigacoes'])
      queryClient.invalidateQueries(['obrigacao', data.id])
      toast.success('Obrigação atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar obrigação')
      console.error(error)
    },
  })
}

export function useDeleteObrigacao() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: obrigacaoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['obrigacoes'])
      toast.success('Obrigação excluída com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir obrigação')
      console.error(error)
    },
  })
}

export function useMarcarConcluida() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: obrigacaoService.marcarConcluida,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['obrigacoes'])
      queryClient.invalidateQueries(['obrigacao', data.id])
      toast.success('Obrigação marcada como concluída!')
    },
    onError: (error) => {
      toast.error('Erro ao marcar obrigação como concluída')
      console.error(error)
    },
  })
}

// Hook para clientes
export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: clienteService.getAll,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCliente(id) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCliente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: clienteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes'])
      toast.success('Cliente criado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar cliente')
      console.error(error)
    },
  })
}

export function useUpdateCliente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => clienteService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clientes'])
      queryClient.invalidateQueries(['cliente', data.id])
      toast.success('Cliente atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar cliente')
      console.error(error)
    },
  })
}

export function useDeleteCliente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: clienteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes'])
      toast.success('Cliente excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir cliente')
      console.error(error)
    },
  })
}

// Hook para responsáveis
export function useResponsaveis() {
  return useQuery({
    queryKey: ['responsaveis'],
    queryFn: responsavelService.getAll,
    staleTime: 10 * 60 * 1000,
  })
}

export function useResponsavel(id) {
  return useQuery({
    queryKey: ['responsavel', id],
    queryFn: () => responsavelService.getById(id),
    enabled: !!id,
  })
}

export function useCreateResponsavel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: responsavelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['responsaveis'])
      toast.success('Responsável criado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar responsável')
      console.error(error)
    },
  })
}

export function useUpdateResponsavel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => responsavelService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['responsaveis'])
      queryClient.invalidateQueries(['responsavel', data.id])
      toast.success('Responsável atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar responsável')
      console.error(error)
    },
  })
}

export function useDeleteResponsavel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: responsavelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['responsaveis'])
      toast.success('Responsável excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir responsável')
      console.error(error)
    },
  })
}

// Hook para histórico
export function useHistorico() {
  return useQuery({
    queryKey: ['historico'],
    queryFn: historicoService.getAll,
    staleTime: 2 * 60 * 1000,
  })
}

export function useHistoricoObrigacao(obrigacaoId) {
  return useQuery({
    queryKey: ['historico', 'obrigacao', obrigacaoId],
    queryFn: () => historicoService.getByObrigacao(obrigacaoId),
    enabled: !!obrigacaoId,
  })
}

// Hook para estatísticas
export function useEstatisticas() {
  return useQuery({
    queryKey: ['estatisticas'],
    queryFn: obrigacaoService.getEstatisticas,
    staleTime: 2 * 60 * 1000,
  })
}
