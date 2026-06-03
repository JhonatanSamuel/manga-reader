@echo off
title MangaBR - Servidor Local
echo.

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [ERRO] Node.js nao encontrado.
    echo.
    echo  Instale em: https://nodejs.org
    echo  Depois execute este arquivo novamente.
    echo.
    pause
    exit /b
)

echo  Iniciando MangaBR...
node "%~dp0server.js"
pause
