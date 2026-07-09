#!/bin/bash

# Script de publicação automática para GitHub Pages
# Uso: bash publish.sh

echo "🚀 Iniciando publicação do Show dos Números..."

# 1. Fazer build
echo "📦 Fazendo build..."
npm run build

# 2. Verificar se o build foi criado
if [ ! -f "dist/index.html" ]; then
  echo "❌ Erro: Build não foi criado!"
  exit 1
fi

echo "✓ Build criado com sucesso"

# 3. Copiar arquivos para a raiz
echo "📋 Copiando arquivos..."
cp dist/index.html ./
cp public/teste.html ./
echo "" > .nojekyll

# 4. Verificar tamanho
SIZE=$(ls -lh index.html | awk '{print $5}')
echo "✓ index.html criado ($SIZE)"

# 5. Commit e push
echo "📤 Publicando no GitHub..."
git add index.html teste.html .nojekyll

# Verificar se há mudanças
if git diff --staged --quiet; then
  echo "⚠️  Nenhuma mudança para publicar"
  exit 0
fi

git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push

echo ""
echo "✅ Publicação concluída!"
echo ""
echo "⏳ Aguarde 2-3 minutos para o GitHub processar..."
echo ""
echo "🌐 Depois acesse:"
echo "   Teste: https://SEU_USUARIO.github.io/REPOSITORIO/teste.html"
echo "   App: https://SEU_USUARIO.github.io/REPOSITORIO/"
echo ""
echo "📖 Para mais informações, veja: SOLUCAO_RAPIDA.md"
