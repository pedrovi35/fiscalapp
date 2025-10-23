import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

// Tipos de ação
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_OBRIGACOES: 'SET_OBRIGACOES',
  SET_CLIENTES: 'SET_CLIENTES',
  SET_RESPONSAVEIS: 'SET_RESPONSAVEIS',
  ADD_OBRIGACAO: 'ADD_OBRIGACAO',
  UPDATE_OBRIGACAO: 'UPDATE_OBRIGACAO',
  DELETE_OBRIGACAO: 'DELETE_OBRIGACAO',
  SET_NOTIFICACOES: 'SET_NOTIFICACOES',
  ADD_NOTIFICACAO: 'ADD_NOTIFICACAO',
  REMOVE_NOTIFICACAO: 'REMOVE_NOTIFICACAO',
  SET_WEBSOCKET_CONNECTED: 'SET_WEBSOCKET_CONNECTED',
  SET_THEME: 'SET_THEME',
  SET_FILTROS: 'SET_FILTROS',
}

// Estado inicial com dados mockados
const initialState = {
  loading: false,
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
    },
    {
      id: 3,
      nome: 'ISS Janeiro 2024',
      descricao: 'Imposto sobre Serviços',
      tipo: 'IMPOSTO',
      dataVencimento: '2024-01-10',
      dataCriacao: '2024-01-01T10:00:00',
      concluida: true,
      statusUrgencia: 'NORMAL',
      diasParaVencimento: -5,
      cliente: { id: 3, nome: 'Comércio DEF Ltda' },
      responsavel: { id: 1, nome: 'João Silva' },
      valor: 800.00,
      observacoes: 'Pago em dia'
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
  notificacoes: [],
  websocketConnected: false,
  theme: localStorage.getItem('theme') || 'light',
  filtros: {
    clienteId: '',
    responsavelId: '',
    tipo: '',
    status: '',
    dataInicio: '',
    dataFim: '',
  },
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ActionTypes.SET_OBRIGACOES:
      return { ...state, obrigacoes: action.payload }
    
    case ActionTypes.SET_CLIENTES:
      return { ...state, clientes: action.payload }
    
    case ActionTypes.SET_RESPONSAVEIS:
      return { ...state, responsaveis: action.payload }
    
    case ActionTypes.ADD_OBRIGACAO:
      return { ...state, obrigacoes: [...state.obrigacoes, action.payload] }
    
    case ActionTypes.UPDATE_OBRIGACAO:
      return {
        ...state,
        obrigacoes: state.obrigacoes.map(obrigacao =>
          obrigacao.id === action.payload.id ? action.payload : obrigacao
        ),
      }
    
    case ActionTypes.DELETE_OBRIGACAO:
      return {
        ...state,
        obrigacoes: state.obrigacoes.filter(obrigacao => obrigacao.id !== action.payload),
      }
    
    case ActionTypes.ADD_NOTIFICACAO:
      return {
        ...state,
        notificacoes: [...state.notificacoes, action.payload],
      }
    
    case ActionTypes.REMOVE_NOTIFICACAO:
      return {
        ...state,
        notificacoes: state.notificacoes.filter(notif => notif.id !== action.payload),
      }
    
    case ActionTypes.SET_WEBSOCKET_CONNECTED:
      return { ...state, websocketConnected: action.payload }
    
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload }
    
    case ActionTypes.SET_FILTROS:
      return { ...state, filtros: { ...state.filtros, ...action.payload } }
    
    default:
      return state
  }
}

// Contexto
const AppContext = createContext()

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // WebSocket (desabilitado temporariamente para evitar erros)
  useEffect(() => {
    // Simular conexão WebSocket
    dispatch({ type: ActionTypes.SET_WEBSOCKET_CONNECTED, payload: true })
    
    // Adicionar algumas notificações de exemplo
    setTimeout(() => {
      dispatch({ 
        type: ActionTypes.ADD_NOTIFICACAO, 
        payload: {
          id: 1,
          tipo: 'OBRIGACAO_CRIADA',
          mensagem: 'Sistema inicializado com sucesso!',
          timestamp: new Date().toISOString()
        }
      })
    }, 1000)
  }, [])

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  // Funções de ação
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    
    setObrigacoes: (obrigacoes) => dispatch({ type: ActionTypes.SET_OBRIGACOES, payload: obrigacoes }),
    
    setClientes: (clientes) => dispatch({ type: ActionTypes.SET_CLIENTES, payload: clientes }),
    
    setResponsaveis: (responsaveis) => dispatch({ type: ActionTypes.SET_RESPONSAVEIS, payload: responsaveis }),
    
    addObrigacao: (obrigacao) => dispatch({ type: ActionTypes.ADD_OBRIGACAO, payload: obrigacao }),
    
    updateObrigacao: (obrigacao) => dispatch({ type: ActionTypes.UPDATE_OBRIGACAO, payload: obrigacao }),
    
    deleteObrigacao: (id) => dispatch({ type: ActionTypes.DELETE_OBRIGACAO, payload: id }),
    
    addNotificacao: (notificacao) => dispatch({ type: ActionTypes.ADD_NOTIFICACAO, payload: notificacao }),
    
    removeNotificacao: (id) => dispatch({ type: ActionTypes.REMOVE_NOTIFICACAO, payload: id }),
    
    toggleTheme: () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      dispatch({ type: ActionTypes.SET_THEME, payload: newTheme })
    },
    
    setFiltros: (filtros) => dispatch({ type: ActionTypes.SET_FILTROS, payload: filtros }),
    
    clearFiltros: () => dispatch({ type: ActionTypes.SET_FILTROS, payload: initialState.filtros }),
  }

  // Computed values
  const computed = {
    obrigacoesFiltradas: state.obrigacoes.filter(obrigacao => {
      const filtros = state.filtros
      
      if (filtros.clienteId && obrigacao.cliente?.id !== parseInt(filtros.clienteId)) {
        return false
      }
      
      if (filtros.responsavelId && obrigacao.responsavel?.id !== parseInt(filtros.responsavelId)) {
        return false
      }
      
      if (filtros.tipo && obrigacao.tipo !== filtros.tipo) {
        return false
      }
      
      if (filtros.status !== '' && obrigacao.concluida !== (filtros.status === 'true')) {
        return false
      }
      
      if (filtros.dataInicio && new Date(obrigacao.dataVencimento) < new Date(filtros.dataInicio)) {
        return false
      }
      
      if (filtros.dataFim && new Date(obrigacao.dataVencimento) > new Date(filtros.dataFim)) {
        return false
      }
      
      return true
    }),
    
    estatisticas: {
      total: state.obrigacoes.length,
      vencidas: state.obrigacoes.filter(o => o.statusUrgencia === 'VENCIDA').length,
      criticas: state.obrigacoes.filter(o => o.statusUrgencia === 'CRÍTICA').length,
      urgentes: state.obrigacoes.filter(o => o.statusUrgencia === 'URGENTE').length,
      normais: state.obrigacoes.filter(o => o.statusUrgencia === 'NORMAL').length,
      concluidas: state.obrigacoes.filter(o => o.concluida).length,
    },
    
    proximasVencimentos: state.obrigacoes
      .filter(o => !o.concluida && o.diasParaVencimento <= 7)
      .sort((a, b) => a.diasParaVencimento - b.diasParaVencimento)
      .slice(0, 10),
  }

  const value = {
    ...state,
    ...actions,
    ...computed,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Hook para usar o contexto
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}

export default AppContext



