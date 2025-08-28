# Script para resolver problemas de arquivos grandes no Git
# Execute este script se você tiver o Git instalado

Write-Host "=== Resolvendo problema de arquivos grandes no Git ===" -ForegroundColor Green

# Verificar se o Git está instalado
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Git não encontrado. Instale o Git primeiro:" -ForegroundColor Red
    Write-Host "https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Remover arquivo grande do cache do Git
Write-Host "Removendo arquivo model.pth do cache do Git..." -ForegroundColor Yellow
git rm --cached "src/ai/godofreda/backend/tts_models/tts/tts_models--multilingual--multi-dataset--xtts_v2/model.pth"

# Remover outros arquivos grandes se existirem
Write-Host "Removendo outros arquivos .pth do cache..." -ForegroundColor Yellow
git rm --cached "src/ai/godofreda/backend/tts_models/tts/tts_models--multilingual--multi-dataset--xtts_v2/speakers_xtts.pth"

# Adicionar as mudanças
Write-Host "Adicionando mudanças..." -ForegroundColor Yellow
git add .gitignore
git add .

# Fazer commit das mudanças
Write-Host "Fazendo commit das mudanças..." -ForegroundColor Yellow
git commit -m "fix: remove large TTS model files and update .gitignore"

Write-Host "=== Problema resolvido! ===" -ForegroundColor Green
Write-Host "Agora você pode fazer push para o GitHub." -ForegroundColor Green
Write-Host "Os modelos TTS devem ser baixados conforme instruções no README." -ForegroundColor Yellow 