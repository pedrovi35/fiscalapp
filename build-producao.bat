@echo off
echo ========================================
echo    Sistema Fiscal - Build de Producao
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
echo Executando build de producao...
npm run build

if %errorlevel% neq 0 (
    echo ERRO: Falha no build de producao!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Build concluido com sucesso!
echo ========================================
echo.
echo Os arquivos foram gerados em: ../src/main/resources/static
echo.
echo Agora voce pode executar o Spring Boot normalmente.
echo Os arquivos React serao servidos automaticamente.
echo.

pause
