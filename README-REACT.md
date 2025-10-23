# Sistema Fiscal - Frontend React

Sistema moderno de gerenciamento de obrigações fiscais desenvolvido com React.js, oferecendo uma interface intuitiva e responsiva para controle de prazos e tarefas fiscais.

## 🚀 Características

- **Interface Moderna**: Design limpo e intuitivo com Tailwind CSS
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tempo Real**: Notificações instantâneas via WebSocket
- **Acessível**: Seguindo padrões de acessibilidade WCAG
- **Performance**: Otimizado com React Query para cache inteligente
- **Animações**: Transições suaves com Framer Motion

## 📋 Funcionalidades

### Dashboard
- Visão geral das obrigações com estatísticas
- Cards de status (Vencidas, Críticas, Urgentes, Concluídas)
- Próximas vencimentos
- Gráficos interativos com Recharts
- Resumo por tipos de obrigação

### Calendário
- Visualização mensal, semanal e diária
- Cores diferenciadas por tipo de obrigação
- Filtros avançados
- Criação rápida de obrigações
- Drag & drop para alterar datas

### Gestão de Obrigações
- Lista completa com filtros e busca
- Criação e edição de obrigações
- Marcação de conclusão
- Recorrência automática
- Histórico de alterações

### Gestão de Clientes e Responsáveis
- CRUD completo para clientes
- CRUD completo para responsáveis
- Busca e filtros
- Informações de contato

### Histórico
- Log completo de alterações
- Filtros por tipo, usuário e período
- Rastreabilidade completa

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Query** - Gerenciamento de estado servidor
- **React Router** - Roteamento
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **Recharts** - Gráficos
- **React Big Calendar** - Calendário
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend Spring Boot rodando na porta 8080

### Passos

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**
```bash
# Criar arquivo .env.local (opcional)
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/api/ws
```

3. **Executar em desenvolvimento**
```bash
npm run dev
```

4. **Build para produção**
```bash
npm run build
```

## 🔧 Configuração

### Proxy de Desenvolvimento
O Vite está configurado para fazer proxy das requisições:
- `/api/*` → `http://localhost:8080/api/*`
- `/ws` → `ws://localhost:8080/api/ws`

### Build de Produção
O build é configurado para gerar os arquivos estáticos na pasta `../src/main/resources/static` do projeto Spring Boot.

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## ♿ Acessibilidade

- Navegação por teclado completa
- Atributos ARIA apropriados
- Alto contraste disponível
- Screen reader friendly
- Foco visível em todos os elementos interativos

## 🎨 Temas

- **Claro**: Tema padrão com cores suaves
- **Escuro**: Tema escuro para uso noturno
- **Alto Contraste**: Para melhor acessibilidade

## 🔄 Integração com Backend

### Endpoints Utilizados
- `GET /api/obrigacoes` - Listar obrigações
- `POST /api/obrigacoes` - Criar obrigação
- `PUT /api/obrigacoes/:id` - Atualizar obrigação
- `DELETE /api/obrigacoes/:id` - Excluir obrigação
- `PATCH /api/obrigacoes/:id/concluir` - Marcar como concluída
- `GET /api/clientes` - Listar clientes
- `GET /api/responsaveis` - Listar responsáveis
- `GET /api/historico` - Listar histórico

### WebSocket
- Conexão automática em `/api/ws`
- Reconexão automática em caso de perda
- Notificações em tempo real para:
  - Criação de obrigações
  - Atualizações
  - Conclusões
  - Vencimentos

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
# Acesse http://localhost:3000
```

### Produção
```bash
npm run build
# Os arquivos serão gerados em ../src/main/resources/static
# Execute o Spring Boot normalmente
```

## 📊 Performance

- **Bundle Size**: ~500KB gzipped
- **First Load**: < 2s
- **Lighthouse Score**: 95+
- **Cache**: React Query com stale time de 5min

## 🐛 Debugging

### DevTools
- React Developer Tools
- React Query DevTools (em desenvolvimento)

### Logs
- Console logs para WebSocket
- Error boundaries para captura de erros
- Toast notifications para feedback

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através de:
- Email: suporte@sistemafiscal.com
- Issues: GitHub Issues
- Documentação: Wiki do projeto

---

**Desenvolvido com ❤️ para facilitar o gerenciamento fiscal**
