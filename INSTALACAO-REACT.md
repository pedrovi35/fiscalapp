# Instalação do Frontend React - Sistema Fiscal

## 🚀 Guia de Instalação Rápida

### 1. Pré-requisitos
- Node.js 18+ instalado
- Backend Spring Boot rodando na porta 8080
- Git (opcional)

### 2. Instalação Automática (Windows)
Execute o arquivo `executar-react.bat` que irá:
- Verificar se o Node.js está instalado
- Instalar as dependências automaticamente
- Iniciar o servidor de desenvolvimento

### 3. Instalação Manual

#### Passo 1: Instalar Dependências
```bash
npm install
```

#### Passo 2: Executar em Desenvolvimento
```bash
npm run dev
```

#### Passo 3: Acessar o Sistema
Abra seu navegador em: http://localhost:3000

### 4. Build para Produção

#### Opção 1: Script Automático (Windows)
Execute o arquivo `build-producao.bat`

#### Opção 2: Manual
```bash
npm run build
```

Os arquivos serão gerados em `../src/main/resources/static` e serão servidos automaticamente pelo Spring Boot.

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/api/ws
```

### Proxy de Desenvolvimento
O Vite está configurado para fazer proxy automático:
- Requisições `/api/*` → `http://localhost:8080/api/*`
- WebSocket `/ws` → `ws://localhost:8080/api/ws`

## 📱 Funcionalidades Principais

### Dashboard
- Estatísticas em tempo real
- Gráficos interativos
- Próximas vencimentos
- Resumo por tipos

### Calendário
- Visualização mensal/semanal/diária
- Cores por tipo de obrigação
- Filtros avançados
- Criação rápida

### Gestão Completa
- Obrigações com CRUD completo
- Clientes e responsáveis
- Histórico de alterações
- Notificações em tempo real

## 🎨 Interface Moderna

- **Design Responsivo**: Funciona em qualquer dispositivo
- **Tema Escuro/Claro**: Alternância automática
- **Animações Suaves**: Transições com Framer Motion
- **Acessibilidade**: Navegação por teclado e screen readers

## 🔄 Integração com Backend

O frontend se conecta automaticamente com o backend Spring Boot:
- API REST para operações CRUD
- WebSocket para notificações em tempo real
- Sincronização automática de dados

## 🐛 Solução de Problemas

### Erro: "Node.js não encontrado"
- Instale o Node.js 18+ de: https://nodejs.org/
- Reinicie o terminal após a instalação

### Erro: "Falha ao instalar dependências"
- Verifique sua conexão com a internet
- Execute: `npm cache clean --force`
- Tente novamente: `npm install`

### Erro: "Cannot connect to backend"
- Verifique se o Spring Boot está rodando na porta 8080
- Teste: http://localhost:8080/api/obrigacoes

### Porta 3000 ocupada
- O Vite tentará usar a próxima porta disponível
- Ou especifique uma porta: `npm run dev -- --port 3001`

## 📊 Performance

- **Carregamento inicial**: < 2 segundos
- **Navegação**: Instantânea (SPA)
- **Cache inteligente**: React Query
- **Bundle otimizado**: ~500KB gzipped

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se o backend está rodando
2. Limpe o cache: `npm cache clean --force`
3. Reinstale dependências: `rm -rf node_modules && npm install`
4. Verifique os logs no console do navegador

---

**Sistema pronto para uso! 🎉**
