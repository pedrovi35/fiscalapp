@echo off
echo Sistema Fiscal - Executando com Maven Wrapper
echo ============================================
echo.

REM Verificar se Java esta instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Java nao encontrado. Instale o Java 17 ou superior.
    pause
    exit /b 1
)

echo Java encontrado!
echo.

REM Tentar executar com Maven se estiver no PATH
mvn -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Maven encontrado no PATH!
    echo Executando aplicacao...
    echo.
    mvn spring-boot:run
    goto :end
)

echo Maven nao encontrado no PATH.
echo.
echo Para executar o sistema, voce precisa:
echo.
echo 1. Instalar o Maven:
echo    - Baixe de: https://maven.apache.org/download.cgi
echo    - Extraia em uma pasta (ex: C:\apache-maven-3.9.0)
echo    - Adicione ao PATH: C:\apache-maven-3.9.0\bin
echo.
echo 2. Ou execute diretamente:
echo    - Encontre o arquivo mvn.cmd na pasta bin do Maven
echo    - Execute: "caminho\para\mvn.cmd" spring-boot:run
echo.
echo 3. Apos configurar, execute:
echo    mvn spring-boot:run
echo.
echo Apos executar, acesse:
echo   Frontend: http://localhost:8080
echo   API: http://localhost:8080/api
echo   Console H2: http://localhost:8080/h2-console
echo.

:end
pause
