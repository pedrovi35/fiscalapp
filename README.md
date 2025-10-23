# Sistema Fiscal - Gerenciamento de Prazos

## 📋 Descrição

Sistema web colaborativo para gerenciamento de prazos fiscais, focado exclusivamente em controle de vencimentos de obrigações, impostos e parcelamentos. O sistema opera online sem exigência de login de usuário, sendo acessível via link compartilhado, onde qualquer pessoa com o link pode visualizar e editar todos os dados em tempo real.

## ✨ Funcionalidades Principais

### 🌐 Acesso Público
- **Sem necessidade de login** - Acessível via link compartilhado
- **Colaboração transparente** entre equipes ou empresas
- **Interface intuitiva** e responsiva

### ⚡ Colaboração em Tempo Real
- **Edições simultâneas** com notificações instantâneas via WebSocket
- **Detecção de conflitos** e mesclagem automática
- **Histórico de alterações** para rastreabilidade completa

### 📊 Dashboard Completo
- **Visão geral** com estatísticas em tempo real
- **Alertas visuais** para obrigações próximas do vencimento
- **Resumo por tipos** de obrigação

### 📆 Calendário Visual
- **Interface estilo Google Calendar** para visualização intuitiva
- **Navegação fluida** entre meses
- **Blocos coloridos** por tipo de obrigação
- **Drag-and-drop** para mover vencimentos
- **Filtros laterais** para múltiplas empresas/clientes/responsáveis

### 🔄 Recorrência Automática
- **Geração inteligente** de obrigações futuras
- **Suporte para recorrências**:
  - Mensal (ex.: todo dia 10)
  - Trimestral (ex.: 15 de março, junho, setembro, dezembro)
  - Customizada (ex.: a cada 45 dias)
- **Geração 'lazy'** - não cria instâncias futuras imediatamente
- **Processamento automático** no primeiro dia útil do mês

### 📅 Regras de Ajuste de Datas
- **Ajuste automático** para fins de semana e feriados
- **Integração com API** de feriados nacionais brasileiros
- **Configuração por obrigação** (postergar ou antecipar)

### ♿ Acessibilidade Total
- **Design WCAG-compliant** com alto contraste
- **Navegação por teclado** completa
- **Alt-text** para leitores de tela
- **Suporte a alto contraste** configurável

## 🏗️ Arquitetura

### Backend (Java Spring Boot)
- **Padrões de Projeto**:
  - Repository Pattern
  - Service Layer Pattern
  - REST Controller Pattern
  - Observer Pattern (WebSocket)
  - Strategy Pattern (Recorrências)
  - Facade Pattern

### Frontend (HTML5 + JavaScript)
- **Design Responsivo** com Bootstrap 5
- **Calendário Interativo** com FullCalendar
- **WebSocket** para colaboração em tempo real
- **Acessibilidade** WCAG-compliant

### Banco de Dados
- **H2 Database** (desenvolvimento)
- **JPA/Hibernate** para persistência
- **Migrações automáticas**

## 🚀 Como Executar

### Pré-requisitos
- Java 17 ou superior
- Maven 3.6 ou superior

### Execução Local
```bash
# Clone o repositório
git clone <repository-url>
cd app-fiscal

# Execute a aplicação
mvn spring-boot:run
```

### Acesso
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api
- **Console H2**: http://localhost:8080/h2-console

## 📚 API Endpoints

### Obrigações
- `GET /api/obrigacoes` - Listar obrigações
- `POST /api/obrigacoes` - Criar obrigação
- `PUT /api/obrigacoes/{id}` - Atualizar obrigação
- `DELETE /api/obrigacoes/{id}` - Excluir obrigação
- `PATCH /api/obrigacoes/{id}/concluir` - Concluir obrigação

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Excluir cliente

### Responsáveis
- `GET /api/responsaveis` - Listar responsáveis
- `POST /api/responsaveis` - Criar responsável
- `PUT /api/responsaveis/{id}` - Atualizar responsável
- `DELETE /api/responsaveis/{id}` - Excluir responsável

### Histórico
- `GET /api/historico/obrigacao/{id}` - Histórico de obrigação
- `GET /api/historico/ultimas` - Últimas alterações

### WebSocket
- `WS /api/ws` - Conexão WebSocket para colaboração em tempo real

## 🔧 Configuração

### application.properties
```properties
# Banco de dados H2
spring.datasource.url=jdbc:h2:mem:fiscal_db
spring.datasource.username=sa
spring.datasource.password=password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Servidor
server.port=8080
server.servlet.context-path=/api

# CORS
spring.web.cors.allowed-origins=*
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- **Desktop** - Interface completa com sidebar
- **Tablet** - Layout adaptado para touch
- **Mobile** - Interface otimizada para telas pequenas

## 🔒 Segurança

- **CORS configurado** para desenvolvimento
- **Validação de dados** com Bean Validation
- **Tratamento de erros** padronizado
- **Logs detalhados** para auditoria

## 🎨 Personalização

### Cores por Tipo de Obrigação
- **Imposto**: Verde (#28a745)
- **Parcelamento**: Amarelo (#ffc107)
- **Declaração**: Azul (#17a2b8)
- **Documento**: Roxo (#6f42c1)
- **Outros**: Cinza (#6c757d)

### Status de Urgência
- **VENCIDA**: Vermelho
- **CRÍTICA** (≤3 dias): Laranja
- **URGENTE** (≤7 dias): Amarelo
- **ATENÇÃO** (≤15 dias): Verde
- **NORMAL**: Cinza

## 🔄 Processamento Automático

### Tarefas Agendadas
- **6:00** - Processamento de recorrências
- **A cada 4 horas** - Verificação de alertas
- **Dia 1 do mês, 2:00** - Limpeza de histórico antigo
- **Último dia do mês, 23:00** - Relatório mensal

## 📈 Monitoramento

### Actuator Endpoints
- `/actuator/health` - Status da aplicação
- `/actuator/info` - Informações da aplicação
- `/actuator/metrics` - Métricas do sistema

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
src/
├── main/
│   ├── java/com/fiscal/
│   │   ├── controller/     # Controllers REST
│   │   ├── service/        # Serviços de negócio
│   │   ├── repository/     # Repositórios JPA
│   │   ├── model/          # Entidades e DTOs
│   │   ├── config/         # Configurações
│   │   └── AppFiscalApplication.java
│   └── resources/
│       ├── static/         # Frontend (HTML, CSS, JS)
│       └── application.properties
└── test/                   # Testes unitários
```

### Padrões Utilizados
- **Repository Pattern** - Abstração de acesso a dados
- **Service Layer Pattern** - Lógica de negócio
- **DTO Pattern** - Transferência de dados
- **Observer Pattern** - Notificações WebSocket
- **Strategy Pattern** - Diferentes tipos de recorrência
- **Facade Pattern** - Interface simplificada para serviços complexos

## 🚀 Deploy

### Heroku
```bash
# Instalar Heroku CLI
# Criar Procfile
echo "web: java -jar target/app-fiscal-0.0.1-SNAPSHOT.jar" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/app-fiscal-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através dos issues do repositório.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
