# Instruções de Instalação e Execução

## Pré-requisitos

### 1. Java 17 ou Superior
- Baixe e instale o Java 17+ do site oficial da Oracle ou OpenJDK
- Verifique a instalação executando: `java -version`

### 2. Maven (Recomendado)
- Baixe o Maven do site oficial: https://maven.apache.org/download.cgi
- Extraia em uma pasta (ex: C:\apache-maven-3.9.0)
- Adicione ao PATH do sistema: C:\apache-maven-3.9.0\bin
- Verifique a instalação executando: `mvn -version`

## Execução

### Opção 1: Com Maven (Recomendado)
```bash
# No diretório do projeto
mvn clean compile
mvn spring-boot:run
```

### Opção 2: Script de Inicialização
- **Windows**: Execute `iniciar.bat`
- **Linux/Mac**: Execute `./iniciar.sh`

### Opção 3: JAR Executável
```bash
# Compilar o projeto
mvn clean package

# Executar o JAR
java -jar target/app-fiscal-0.0.1-SNAPSHOT.jar
```

## Acesso à Aplicação

Após executar com sucesso, acesse:

- **Frontend**: http://localhost:8080
- **API REST**: http://localhost:8080/api
- **Console H2**: http://localhost:8080/h2-console
- **WebSocket**: ws://localhost:8080/api/ws

## Configuração do Banco de Dados

### Desenvolvimento (H2 - Padrão)
- Banco em memória
- Console disponível em: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:fiscal_db`
- Usuário: `sa`
- Senha: `password`

### Produção (PostgreSQL)
- Configure as variáveis de ambiente:
  - `DATABASE_URL`: URL do PostgreSQL
  - `DB_USERNAME`: Usuário do banco
  - `DB_PASSWORD`: Senha do banco

## Deploy

### Heroku
```bash
# Instalar Heroku CLI
# Fazer login
heroku login

# Criar app
heroku create seu-app-fiscal

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Docker
```bash
# Build da imagem
docker build -t app-fiscal .

# Executar container
docker run -p 8080:8080 app-fiscal
```

## Solução de Problemas

### Erro: "mvn não é reconhecido"
- Instale o Maven e adicione ao PATH do sistema
- Ou use o script de inicialização

### Erro: "Java não encontrado"
- Instale o Java 17 ou superior
- Verifique se está no PATH do sistema

### Erro de Porta em Uso
- A porta 8080 está sendo usada por outro processo
- Pare o processo ou configure outra porta em `application.properties`

### Problemas de CORS
- Configure `spring.web.cors.allowed-origins` em `application.properties`
- Para desenvolvimento, use `*` (não recomendado para produção)

## Funcionalidades Testadas

✅ **Backend**
- Criação de obrigações
- Atualização de obrigações
- Sistema de recorrências
- WebSocket para colaboração
- Histórico de alterações
- Ajuste automático de datas

✅ **Frontend**
- Interface responsiva
- Calendário interativo
- Dashboard com estatísticas
- Notificações em tempo real
- Acessibilidade WCAG

✅ **Integração**
- API REST completa
- WebSocket funcional
- Banco de dados H2
- Sistema de logs

## Próximos Passos

1. **Instalar Maven** para execução completa
2. **Configurar PostgreSQL** para produção
3. **Personalizar cores** e tipos de obrigação
4. **Adicionar mais filtros** no calendário
5. **Implementar relatórios** em PDF/Excel

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs da aplicação
2. Consulte a documentação da API
3. Teste com o banco H2 primeiro
4. Verifique as configurações de rede/firewall
