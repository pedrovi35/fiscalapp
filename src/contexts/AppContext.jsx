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

// Estado inicial
const initialState = {
  loading: false,
  obrigacoes: [],
  clientes: [],
  responsaveis: [],
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

  // WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/api/ws`
    
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      dispatch({ type: ActionTypes.SET_WEBSOCKET_CONNECTED, payload: true })
      toast.success('Conectado ao sistema')
    }
    
    ws.onmessage = (event) => {
      try {
        const notificacao = JSON.parse(event.data)
        dispatch({ type: ActionTypes.ADD_NOTIFICACAO, payload: notificacao })
        
        // Mostrar toast baseado no tipo
        switch (notificacao.tipo) {
          case 'OBRIGACAO_CRIADA':
            toast.success('Nova obrigação criada')
            break
          case 'OBRIGACAO_ATUALIZADA':
            toast.info('Obrigação atualizada')
            break
          case 'OBRIGACAO_CONCLUIDA':
            toast.success('Obrigação concluída')
            break
          case 'OBRIGACAO_VENCIDA':
            toast.error('Obrigação vencida!')
            break
          default:
            toast(notificacao.mensagem)
        }
      } catch (error) {
        console.error('Erro ao processar notificação WebSocket:', error)
      }
    }
    
    ws.onclose = () => {
      dispatch({ type: ActionTypes.SET_WEBSOCKET_CONNECTED, payload: false })
      toast.error('Conexão perdida. Tentando reconectar...')
      
      // Tentar reconectar após 5 segundos
      setTimeout(() => {
        if (ws.readyState === WebSocket.CLOSED) {
          window.location.reload()
        }
      }, 5000)
    }
    
    ws.onerror = (error) => {
      console.error('Erro WebSocket:', error)
      toast.error('Erro de conexão')
    }
    
    return () => {
      ws.close()
    }
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



