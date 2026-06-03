@echo off
title Deploy MangaBR
color 0B
echo.
echo  ==========================================
echo   PASSO 2 — Subindo para GitHub + Vercel
echo  ==========================================
echo.

set GH="C:\Users\jhona\AppData\Local\Temp\gh_cli\bin\gh.exe"
cd /d "C:\Users\jhona\manga-reader"

echo  [1/3] Criando repositorio no GitHub...
%GH% repo create manga-reader --public --source=. --remote=origin2 --push --description "Leitor de mangas em portugues" 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  Repositorio pode ja existir, tentando push direto...
    git remote remove origin2 2>nul
    %GH% repo create manga-reader --public 2>nul
    git remote add origin2 https://github.com/JhonatanSamuel/manga-reader.git 2>nul
    git push origin2 master --force
)

echo.
echo  [2/3] Repositorio no GitHub: https://github.com/JhonatanSamuel/manga-reader
echo.

echo  [3/3] Fazendo deploy no Vercel...
echo  (Uma pagina vai abrir para voce entrar no Vercel — pode usar "Continue with GitHub")
echo.
npx vercel --prod --yes 2>&1

echo.
echo  ==========================================
echo   Pronto! Copie o link acima e cole no chat.
echo  ==========================================
echo.
pause
