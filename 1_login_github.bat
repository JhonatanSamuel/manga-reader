@echo off
title Login GitHub
color 0A
echo.
echo  ==========================================
echo   PASSO 1 — Login no GitHub
echo  ==========================================
echo.
echo  Uma pagina vai abrir no navegador.
echo  Clique em "Authorize GitHub CLI" e volte aqui.
echo.
pause

"C:\Users\jhona\AppData\Local\Temp\gh_cli\bin\gh.exe" auth login --web -h github.com

echo.
if %ERRORLEVEL% == 0 (
    color 0A
    echo  Login feito com sucesso!
    echo  Agora clique duas vezes em: 2_deploy.bat
) else (
    color 0C
    echo  Algo deu errado. Tente novamente.
)
echo.
pause
