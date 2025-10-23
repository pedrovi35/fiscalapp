@echo off
echo ========================================
echo    Sistema Fiscal - Frontend React
echo ========================================
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

echo Verificando se as dependencias estao instaladas...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo Dependencias instaladas com sucesso!
) else (
    echo Dependencias ja estao instaladas.
)

echo.
echo ========================================
echo    Iniciando Frontend React
echo ========================================
echo.
echo O frontend estara disponivel em: http://localhost:3000
echo.
echo IMPORTANTE: Certifique-se de que o backend Spring Boot
echo esta rodando na porta 8080 antes de usar o frontend!
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev

pause
