import axios from 'axios'

const API_BASE_URL = '/api'

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error)
    return Promise.reject(error)
  }
)

// Serviços para Obrigações
export const obrigacaoService = {
  // Buscar todas as obrigações
  async getAll() {
    const response = await api.get('/obrigacoes')
    return response.data
  },

  // Buscar obrigação por ID
  async getById(id) {
    const response = await api.get(`/obrigacoes/${id}`)
    return response.data
  },

  // Criar nova obrigação
  async create(obrigacao) {
    const response = await api.post('/obrigacoes', obrigacao)
    return response.data
  },

  // Atualizar obrigação
  async update(id, obrigacao) {
    const response = await api.put(`/obrigacoes/${id}`, obrigacao)
    return response.data
  },

  // Deletar obrigação
  async delete(id) {
    const response = await api.delete(`/obrigacoes/${id}`)
    return response.data
  },

  // Marcar como concluída
  async marcarConcluida(id) {
    const response = await api.patch(`/obrigacoes/${id}/concluir`)
    return response.data
  },

  // Buscar obrigações por filtros
  async getByFilters(filtros) {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const response = await api.get(`/obrigacoes/filtros?${params}`)
    return response.data
  },

  // Buscar estatísticas
  async getEstatisticas() {
    const response = await api.get('/obrigacoes/estatisticas')
    return response.data
  },
}

// Serviços para Clientes
export const clienteService = {
  // Buscar todos os clientes
  async getAll() {
    const response = await api.get('/clientes')
    return response.data
  },

  // Buscar cliente por ID
  async getById(id) {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  // Criar novo cliente
  async create(cliente) {
    const response = await api.post('/clientes', cliente)
    return response.data
  },

  // Atualizar cliente
  async update(id, cliente) {
    const response = await api.put(`/clientes/${id}`, cliente)
    return response.data
  },

  // Deletar cliente
  async delete(id) {
    const response = await api.delete(`/clientes/${id}`)
    return response.data
  },
}

// Serviços para Responsáveis
export const responsavelService = {
  // Buscar todos os responsáveis
  async getAll() {
    const response = await api.get('/responsaveis')
    return response.data
  },

  // Buscar responsável por ID
  async getById(id) {
    const response = await api.get(`/responsaveis/${id}`)
    return response.data
  },

  // Criar novo responsável
  async create(responsavel) {
    const response = await api.post('/responsaveis', responsavel)
    return response.data
  },

  // Atualizar responsável
  async update(id, responsavel) {
    const response = await api.put(`/responsaveis/${id}`, responsavel)
    return response.data
  },

  // Deletar responsável
  async delete(id) {
    const response = await api.delete(`/responsaveis/${id}`)
    return response.data
  },
}

// Serviços para Histórico
export const historicoService = {
  // Buscar histórico de alterações
  async getAll() {
    const response = await api.get('/historico')
    return response.data
  },

  // Buscar histórico por obrigação
  async getByObrigacao(obrigacaoId) {
    const response = await api.get(`/historico/obrigacao/${obrigacaoId}`)
    return response.data
  },

  // Buscar histórico por usuário
  async getByUsuario(usuario) {
    const response = await api.get(`/historico/usuario/${usuario}`)
    return response.data
  },
}

// Serviços para Recorrência
export const recorrenciaService = {
  // Criar recorrência
  async create(recorrencia) {
    const response = await api.post('/recorrencias', recorrencia)
    return response.data
  },

  // Atualizar recorrência
  async update(id, recorrencia) {
    const response = await api.put(`/recorrencias/${id}`, recorrencia)
    return response.data
  },

  // Deletar recorrência
  async delete(id) {
    const response = await api.delete(`/recorrencias/${id}`)
    return response.data
  },

  // Processar recorrências
  async processar() {
    const response = await api.post('/recorrencias/processar')
    return response.data
  },
}

// Utilitários
export const utils = {
  // Calcular dias para vencimento
  calcularDiasParaVencimento(dataVencimento) {
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = vencimento - hoje
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  },

  // Determinar status de urgência
  determinarStatusUrgencia(diasParaVencimento) {
    if (diasParaVencimento < 0) return 'VENCIDA'
    if (diasParaVencimento <= 3) return 'CRÍTICA'
    if (diasParaVencimento <= 7) return 'URGENTE'
    if (diasParaVencimento <= 15) return 'ATENÇÃO'
    return 'NORMAL'
  },

  // Obter cor do tipo
  getCorTipo(tipo) {
    const cores = {
      'IMPOSTO': '#28a745',
      'PARCELAMENTO': '#ffc107',
      'DECLARACAO': '#17a2b8',
      'DOCUMENTO': '#6f42c1',
      'OUTROS': '#6c757d'
    }
    return cores[tipo] || '#6c757d'
  },

  // Obter nome do tipo
  getNomeTipo(tipo) {
    const nomes = {
      'IMPOSTO': 'Imposto',
      'PARCELAMENTO': 'Parcelamento',
      'DECLARACAO': 'Declaração',
      'DOCUMENTO': 'Documento',
      'OUTROS': 'Outros'
    }
    return nomes[tipo] || tipo
  },

  // Formatar data
  formatarData(data, formato = 'dd/MM/yyyy') {
    if (!data) return ''
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR')
  },

  // Formatar data e hora
  formatarDataHora(data) {
    if (!data) return ''
    const date = new Date(data)
    return date.toLocaleString('pt-BR')
  },
}

export default api
