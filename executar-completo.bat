@echo off
echo ========================================
echo    Sistema Fiscal - Execucao Completa
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

echo Verificando se o Node.js esta instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js 18+ de: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo ========================================
echo    Iniciando Backend Spring Boot
echo ========================================
echo.

echo Compilando e executando o backend...
start "Backend Spring Boot" cmd /k "mvn spring-boot:run"

echo Aguardando o backend inicializar...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    Iniciando Frontend React
echo ========================================
echo.

echo Verificando dependencias do frontend...
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias do frontend!
        pause
        exit /b 1
    )
)

echo Iniciando o frontend...
start "Frontend React" cmd /k "npm run dev"

echo.
echo ========================================
echo    Sistema Iniciado com Sucesso!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para abrir o sistema no navegador...
pause >nul

start http://localhost:3000

echo.
echo Para parar os servidores, feche as janelas do terminal que foram abertas.
echo.
pause
