#!/bin/bash

echo "========================================"
echo "   Sistema Fiscal - Execução Completa"
echo "========================================"
echo

# Verificar Java
echo "Verificando se o Java está instalado..."
if ! command -v java &> /dev/null; then
    echo "ERRO: Java não encontrado!"
    echo "Por favor, instale o Java 17+ de: https://adoptium.net/"
    exit 1
fi

echo "Java encontrado!"
echo

# Verificar Maven
echo "Verificando se o Maven está instalado..."
if ! command -v mvn &> /dev/null; then
    echo "ERRO: Maven não encontrado!"
    echo "Por favor, instale o Maven de: https://maven.apache.org/"
    exit 1
fi

echo "Maven encontrado!"
echo

# Verificar Node.js
echo "Verificando se o Node.js está instalado..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Por favor, instale o Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

echo "Node.js encontrado!"
echo

echo "========================================"
echo "   Iniciando Backend Spring Boot"
echo "========================================"
echo

# Compilar e executar backend em background
echo "Compilando e executando o backend..."
mvn spring-boot:run &
BACKEND_PID=$!

echo "Aguardando o backend inicializar..."
sleep 15

echo
echo "========================================"
echo "   Iniciando Frontend React"
echo "========================================"
echo

# Verificar dependências do frontend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha ao instalar dependências do frontend!"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

echo "Iniciando o frontend..."
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "   Sistema Iniciado com Sucesso!"
echo "========================================"
echo
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo
echo "Pressione Ctrl+C para parar ambos os servidores"
echo

# Função para limpar processos ao sair
cleanup() {
    echo
    echo "Parando servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servidores parados."
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Aguardar
wait
