$GH  = "$env:TEMP\gh_cli\bin\gh.exe"
$DIR = "C:\Users\jhona\manga-reader"

Set-Location $DIR

Write-Host "`n=== Criando repositorio no GitHub ===" -ForegroundColor Cyan
& $GH repo create manga-reader --public --source=. --remote=origin --push --description "Leitor de mangas em portugues"

if ($LASTEXITCODE -ne 0) { Write-Host "Erro ao criar repo." -ForegroundColor Red; exit 1 }

Write-Host "`n=== Fazendo deploy no Vercel ===" -ForegroundColor Cyan
npx vercel --prod --yes --cwd $DIR

Write-Host "`nPronto! Veja o link acima ^" -ForegroundColor Green
