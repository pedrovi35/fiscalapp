#!/bin/bash

echo "========================================"
echo "   Sistema Fiscal - Backend Spring Boot"
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

echo "========================================"
echo "   Compilando e Executando Backend"
echo "========================================"
echo

echo "Limpando compilações anteriores..."
mvn clean

echo
echo "Compilando o projeto..."
mvn compile

if [ $? -ne 0 ]; then
    echo "ERRO: Falha na compilação!"
    exit 1
fi

echo
echo "Executando o Spring Boot..."
echo
echo "O backend estará disponível em: http://localhost:8080"
echo "API disponível em: http://localhost:8080/api"
echo "WebSocket disponível em: ws://localhost:8080/api/ws"
echo
echo "Pressione Ctrl+C para parar o servidor"
echo

mvn spring-boot:run
