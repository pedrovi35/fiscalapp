import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

const NotificacaoContext = createContext()

export const useNotificacao = () => {
  const context = useContext(NotificacaoContext)
  if (!context) {
    throw new Error('useNotificacao deve ser usado dentro de NotificacaoProvider')
  }
  return context
}

export const NotificacaoProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([])
  const [stompClient, setStompClient] = useState(null)
  const [conectado, setConectado] = useState(false)
  const [usuariosConectados, setUsuariosConectados] = useState([])

  useEffect(() => {
    // Simular conexão WebSocket para demonstração
    setConectado(true)
    
    // Adicionar algumas notificações de exemplo
    setTimeout(() => {
      processarNotificacao({
        id: 1,
        tipo: 'OBRIGACAO_CRIADA',
        mensagem: 'Sistema inicializado com sucesso!',
        usuarioEditor: 'Sistema',
        timestamp: new Date().toISOString()
      })
    }, 1000)
    
    setTimeout(() => {
      processarNotificacao({
        id: 2,
        tipo: 'USUARIO_CONECTADO',
        mensagem: 'Usuário conectado ao sistema',
        usuarioEditor: 'Sistema',
        timestamp: new Date().toISOString()
      })
    }, 2000)
  }, [])

  const conectarWebSocket = () => {
    const socket = new SockJS('/ws')
    const stomp = Stomp.over(socket)
    
    stomp.debug = false
    
    stomp.connect({}, () => {
      setConectado(true)
      setStompClient(stomp)
      
      // Subscrever ao tópico de colaboração
      stomp.subscribe('/topic/colaboracao', (message) => {
        const notificacao = JSON.parse(message.body)
        processarNotificacao(notificacao)
      })
      
      // Subscrever ao tópico de notificações pessoais
      stomp.subscribe('/user/queue/notificacoes', (message) => {
        const notificacao = JSON.parse(message.body)
        processarNotificacao(notificacao)
      })
      
      // Conectar usuário
      conectarUsuario()
    })
  }

  const conectarUsuario = () => {
    if (stompClient) {
      const usuario = localStorage.getItem('usuario') || 'Usuário Anônimo'
      const pagina = window.location.pathname
      
      stompClient.send('/app/conectar', {}, JSON.stringify({
        usuario,
        pagina
      }))
    }
  }

  const processarNotificacao = (notificacao) => {
    // Adicionar à lista de notificações
    setNotificacoes(prev => [notificacao, ...prev.slice(0, 49)]) // Manter últimas 50
    
    // Mostrar toast baseado no tipo
    switch (notificacao.tipo) {
      case 'OBRIGACAO_CRIADA':
        toast.success(`✅ ${notificacao.mensagem}`, {
          duration: 4000,
          icon: '📋'
        })
        break
        
      case 'OBRIGACAO_ATUALIZADA':
        toast.info(`📝 ${notificacao.mensagem}`, {
          duration: 3000,
          icon: '✏️'
        })
        break
        
      case 'OBRIGACAO_CONCLUIDA':
        toast.success(`🎉 ${notificacao.mensagem}`, {
          duration: 4000,
          icon: '✅'
        })
        break
        
      case 'CONFLITO_EDICAO':
        toast.error(`⚠️ ${notificacao.mensagem}`, {
          duration: 6000,
          icon: '⚠️'
        })
        break
        
      case 'USUARIO_CONECTADO':
        toast.success(`👋 ${notificacao.mensagem}`, {
          duration: 2000,
          icon: '👤'
        })
        break
        
      case 'USUARIO_DESCONECTADO':
        toast.info(`👋 ${notificacao.mensagem}`, {
          duration: 2000,
          icon: '👤'
        })
        break
        
      default:
        toast(notificacao.mensagem, {
          duration: 3000
        })
    }
  }

  const notificarMudanca = (tipo, mensagem, dados = {}) => {
    if (stompClient) {
      const usuario = localStorage.getItem('usuario') || 'Usuário Anônimo'
      
      stompClient.send('/app/notificar', {}, JSON.stringify({
        tipo,
        mensagem,
        dados,
        usuario
      }))
    }
  }

  const iniciarEdicao = (entidade, id) => {
    if (stompClient) {
      const usuario = localStorage.getItem('usuario') || 'Usuário Anônimo'
      
      stompClient.send('/app/iniciar-edicao', {}, JSON.stringify({
        entidade,
        id,
        usuario
      }))
    }
  }

  const finalizarEdicao = (entidade, id) => {
    if (stompClient) {
      const usuario = localStorage.getItem('usuario') || 'Usuário Anônimo'
      
      stompClient.send('/app/finalizar-edicao', {}, JSON.stringify({
        entidade,
        id,
        usuario
      }))
    }
  }

  const atualizarPagina = (pagina) => {
    if (stompClient) {
      stompClient.send('/app/atualizar-pagina', {}, JSON.stringify({
        pagina
      }))
    }
  }

  const limparNotificacoes = () => {
    setNotificacoes([])
  }

  const marcarComoLida = (id) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    )
  }

  const value = {
    notificacoes,
    conectado,
    usuariosConectados,
    notificarMudanca,
    iniciarEdicao,
    finalizarEdicao,
    atualizarPagina,
    limparNotificacoes,
    marcarComoLida
  }

  return (
    <NotificacaoContext.Provider value={value}>
      {children}
    </NotificacaoContext.Provider>
  )
}
