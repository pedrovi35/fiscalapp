@echo off
echo ========================================
echo    Sistema Fiscal - Backend Spring Boot
echo ========================================
echo.

echo Verificando se o Java esta instalado...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Java nao encontrado!
    echo Por favor, instale o Java 17+ de: https://adoptium.net/
    pause
    exit /b 1
)

echo Java encontrado!
echo.

echo Verificando se o Maven esta instalado...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Maven nao encontrado!
    echo Por favor, instale o Maven de: https://maven.apache.org/
    pause
    exit /b 1
)

echo Maven encontrado!
echo.

echo ========================================
echo    Compilando e Executando Backend
echo ========================================
echo.

echo Limpando compilacoes anteriores...
mvn clean

echo.
echo Compilando o projeto...
mvn compile

if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao!
    pause
    exit /b 1
)

echo.
echo Executando o Spring Boot...
echo.
echo O backend estara disponivel em: http://localhost:8080
echo API disponivel em: http://localhost:8080/api
echo WebSocket disponivel em: ws://localhost:8080/api/ws
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

mvn spring-boot:run

pause
