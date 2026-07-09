# 🎯 Show dos Números - Guia de Deploy

## ⚡ Deploy Rápido (3 passos)

### 1️⃣ Execute o script de publicação:

```bash
bash publish.sh
```

### 2️⃣ Aguarde 2-3 minutos

### 3️⃣ Teste:

```
https://SEU_USUARIO.github.io/REPOSITORIO/teste.html
```

---

## 📁 Estrutura do Repositório

Após publicar, seu repositório deve ter:

```
seu-repositorio/
├── index.html        ← App principal
├── teste.html        ← Página de teste
├── .nojekyll        ← Impede processamento do GitHub
├── src/             ← Código fonte
├── dist/            ← Build (gerado automaticamente)
└── package.json
```

---

## 🧪 Testando Localmente

### Opção 1: Script de publicação
```bash
bash publish.sh
```

### Opção 2: Manual
```bash
# Build
npm run build

# Copiar arquivos
cp dist/index.html ./
cp public/teste.html ./
echo "" > .nojekyll

# Commit e push
git add index.html teste.html .nojekyll
git commit -m "Deploy"
git push
```

---

## 🔍 Diagnóstico de Problemas

### Página de Teste

Antes de testar o app completo, acesse:
```
https://SEU_USUARIO.github.io/REPOSITORIO/teste.html
```

**Se aparecer:** ✅ Ambiente OK
**Se não aparecer:** ❌ Problema no GitHub (veja abaixo)

### Problemas Comuns

#### ❌ Página em branco

1. **Abra o Console** (F12)
2. **Procure erros em vermelho**
3. **Me envie screenshot**

#### ❌ Erro 404

1. Verifique se os arquivos foram publicados:
   - `index.html` existe?
   - `.nojekyll` existe?

2. Verifique GitHub Pages:
   - Settings → Pages
   - Source: `main` branch, `/ (root)`

#### ❌ MIME type error

Crie/verifique o arquivo `.nojekyll`:
```bash
echo "" > .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll"
git push
```

---

## 🌐 Alternativas de Hospedagem

### Netlify (Recomendado - Mais Fácil)

1. Acesse: https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Selecione seu repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy automático!

### Vercel

1. Acesse: https://vercel.com
2. "New Project"
3. Importe seu repositório
4. Deploy automático!

### GitHub Pages com Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📊 Verificação

Após publicar, verifique:

- [ ] `index.html` está no repositório (~1MB)
- [ ] `.nojekyll` existe
- [ ] GitHub Pages configurado
- [ ] URL funciona: `https://usuario.github.io/repo/`
- [ ] Teste funciona: `https://usuario.github.io/repo/teste.html`
- [ ] Console sem erros (F12)

---

## 🆘 Precisa de Ajuda?

Me envie:

1. **URL do GitHub Pages**
2. **Screenshot do Console** (F12)
3. **Screenshot da aba Network** (F12)
4. **Lista de arquivos do repositório**
5. **Configuração do GitHub Pages** (Settings → Pages)

---

## 📝 Comandos Úteis

### Verificar arquivos publicados
```bash
git ls-files | grep -E "index.html|teste.html|.nojekyll"
```

### Verificar tamanho do index.html
```bash
ls -lh index.html
```

### Ver logs do GitHub Actions
```
https://github.com/SEU_USUARIO/REPOSITORIO/actions
```

### Limpar cache do GitHub Pages
```
Settings → Pages → "Clear cache"
```

---

## 🎯 URLs Importantes

- **App:** `https://SEU_USUARIO.github.io/REPOSITORIO/`
- **Teste:** `https://SEU_USUARIO.github.io/REPOSITORIO/teste.html`
- **GitHub Pages:** `https://github.com/SEU_USUARIO/REPOSITORIO/settings/pages`
- **Actions:** `https://github.com/SEU_USUARIO/REPOSITORIO/actions`

---

## ✅ Checklist Final

Antes de publicar:

- [ ] `npm run build` executado sem erros
- [ ] `dist/index.html` gerado (~1MB)
- [ ] `dist/index.html` copiado para raiz
- [ ] `public/teste.html` copiado para raiz
- [ ] `.nojekyll` criado
- [ ] Commit feito
- [ ] Push realizado
- [ ] Aguardou 2-3 minutos
- [ ] Testou `teste.html`
- [ ] Testou `index.html`
- [ ] Verificou Console (F12)

---

## 🚀 Pronto!

Se seguiu todos os passos e ainda tem problemas, me envie as informações do checklist acima que vou te ajudar a resolver! 💪
