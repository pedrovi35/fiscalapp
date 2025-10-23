#!/bin/bash

echo "Sistema Fiscal - Gerenciamento de Prazos"
echo "======================================"
echo ""
echo "Iniciando aplicação..."
echo ""

# Verificar se Java está instalado
if ! command -v java &> /dev/null; then
    echo "ERRO: Java não encontrado. Instale o Java 17 ou superior."
    exit 1
fi

# Verificar versão do Java
java -version

# Criar diretório target se não existir
mkdir -p target/classes

echo ""
echo "Para executar a aplicação completa, instale o Maven e execute:"
echo "  mvn spring-boot:run"
echo ""
echo "Após executar, acesse:"
echo "  Frontend: http://localhost:8080"
echo "  API: http://localhost:8080/api"
echo "  Console H2: http://localhost:8080/h2-console"
echo ""
