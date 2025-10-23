import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { obrigacaoService, clienteService, responsavelService, historicoService } from '../services/api'
import toast from 'react-hot-toast'

// Dados mockados para quando a API não estiver disponível
const mockData = {
  obrigacoes: [
    {
      id: 1,
      nome: 'ICMS Janeiro 2024',
      descricao: 'Imposto sobre Circulação de Mercadorias e Serviços',
      tipo: 'IMPOSTO',
      dataVencimento: '2024-01-15',
      dataCriacao: '2024-01-01T10:00:00',
      concluida: false,
      statusUrgencia: 'NORMAL',
      diasParaVencimento: 5,
      cliente: { id: 1, nome: 'Empresa ABC Ltda' },
      responsavel: { id: 1, nome: 'João Silva' },
      valor: 1500.00,
      observacoes: 'Pagamento via PIX'
    },
    {
      id: 2,
      nome: 'IPI Janeiro 2024',
      descricao: 'Imposto sobre Produtos Industrializados',
      tipo: 'IMPOSTO',
      dataVencimento: '2024-01-25',
      dataCriacao: '2024-01-01T10:00:00',
      concluida: false,
      statusUrgencia: 'URGENTE',
      diasParaVencimento: 2,
      cliente: { id: 2, nome: 'Indústria XYZ S/A' },
      responsavel: { id: 2, nome: 'Maria Santos' },
      valor: 2500.00,
      observacoes: 'Parcelamento em 3x'
    }
  ],
  clientes: [
    { id: 1, nome: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90', email: 'contato@abc.com.br', telefone: '(11) 99999-9999' },
    { id: 2, nome: 'Indústria XYZ S/A', cnpj: '98.765.432/0001-10', email: 'contato@xyz.com.br', telefone: '(11) 88888-8888' },
    { id: 3, nome: 'Comércio DEF Ltda', cnpj: '11.222.333/0001-44', email: 'contato@def.com.br', telefone: '(11) 77777-7777' }
  ],
  responsaveis: [
    { id: 1, nome: 'João Silva', email: 'joao@empresa.com', telefone: '(11) 99999-9999', cargo: 'Contador' },
    { id: 2, nome: 'Maria Santos', email: 'maria@empresa.com', telefone: '(11) 88888-8888', cargo: 'Assistente Contábil' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@empresa.com', telefone: '(11) 77777-7777', cargo: 'Analista Fiscal' }
  ],
  estatisticas: {
    total: 3,
    vencidas: 0,
    criticas: 0,
    urgentes: 1,
    normais: 2,
    concluidas: 0
  }
}

// Função para simular delay da API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Hook para obrigações
export function useObrigacoes() {
  return useQuery({
    queryKey: ['obrigacoes'],
    queryFn: async () => {
      try {
        await delay(500) // Simular delay da API
        return mockData.obrigacoes
      } catch (error) {
        console.log('Usando dados mockados para obrigações')
        return mockData.obrigacoes
      }
    },
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
    queryFn: async () => {
      try {
        await delay(300)
        return mockData.clientes
      } catch (error) {
        console.log('Usando dados mockados para clientes')
        return mockData.clientes
      }
    },
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
    queryFn: async () => {
      try {
        await delay(300)
        return mockData.responsaveis
      } catch (error) {
        console.log('Usando dados mockados para responsáveis')
        return mockData.responsaveis
      }
    },
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
    queryFn: async () => {
      try {
        await delay(200)
        return mockData.estatisticas
      } catch (error) {
        console.log('Usando dados mockados para estatísticas')
        return mockData.estatisticas
      }
    },
    staleTime: 2 * 60 * 1000,
  })
}
