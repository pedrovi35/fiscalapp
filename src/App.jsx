import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './contexts/AppContext'
import { NotificacaoProvider } from './contexts/NotificacaoContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Obrigacoes from './pages/Obrigacoes'
import Impostos from './pages/Impostos'
import Parcelamentos from './pages/Parcelamentos'
import Clientes from './pages/Clientes'
import Responsaveis from './pages/Responsaveis'
import Historico from './pages/Historico'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <NotificacaoProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/obrigacoes" element={<Obrigacoes />} />
                  <Route path="/impostos" element={<Impostos />} />
                  <Route path="/parcelamentos" element={<Parcelamentos />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/responsaveis" element={<Responsaveis />} />
                  <Route path="/historico" element={<Historico />} />
                </Routes>
              </Layout>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </Router>
        </NotificacaoProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App



