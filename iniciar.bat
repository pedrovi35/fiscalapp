@echo off
echo Sistema Fiscal - Gerenciamento de Prazos
echo ======================================
echo.
echo Iniciando aplicacao...
echo.

REM Verificar se Java esta instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Java nao encontrado. Instale o Java 17 ou superior.
    pause
    exit /b 1
)

REM Criar diretorio target se nao existir
if not exist "target" mkdir target

REM Compilar e executar a aplicacao
echo Compilando aplicacao...
javac -cp "lib/*" -d target/classes src/main/java/com/fiscal/*.java src/main/java/com/fiscal/*/*.java 2>nul

if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao. Verifique as dependencias.
    echo.
    echo Para executar corretamente, instale o Maven e execute:
    echo   mvn spring-boot:run
    echo.
    pause
    exit /b 1
)

echo.
echo Aplicacao compilada com sucesso!
echo.
echo Para executar a aplicacao completa, instale o Maven e execute:
echo   mvn spring-boot:run
echo.
echo Apos executar, acesse:
echo   Frontend: http://localhost:8080
echo   API: http://localhost:8080/api
echo   Console H2: http://localhost:8080/h2-console
echo.
pause
