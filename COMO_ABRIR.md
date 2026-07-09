# Como Abrir o Show dos Números

## ⚠️ Problema: Página Branca ao Abrir com Duplo Clique

Quando você abre o arquivo `dist/index.html` diretamente no navegador (duplo clique), a página pode ficar em branco. Isso acontece porque o navegador usa o protocolo `file://` e há restrições de segurança que bloqueiam módulos ES6.

## ✅ Soluções

### Opção 1: Usar um Servidor Local (RECOMENDADO)

#### Com Python (se instalado):
```bash
cd dist
python -m http.server 8000
```
Depois abra: http://localhost:8000

#### Com Node.js:
```bash
npx serve dist
```
Depois abra o URL que aparecer (geralmente http://localhost:3000)

#### Com VS Code:
1. Instale a extensão "Live Server"
2. Clique com botão direito em `dist/index.html`
3. Selecione "Open with Live Server"

### Opção 2: Firefox (Mais Permissivo)

O Firefox geralmente permite abrir arquivos HTML locais com módulos ES6. Tente abrir o arquivo com Firefox em vez de Chrome/Edge.

### Opção 3: Desabilitar Segurança do Chrome (NÃO RECOMENDADO)

⚠️ **Apenas para testes, não use para navegação normal!**

No Windows:
```bash
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
```

No Mac:
```bash
open -na "Google Chrome" --args --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

Depois abra o arquivo normalmente.

### Opção 4: Hospedar Online

Faça upload da pasta `dist` para:
- GitHub Pages
- Netlify
- Vercel
- Qualquer hospedagem web

## 🔍 Verificando se Funcionou

Quando abrir corretamente, você verá:
1. Tela de login com logo "B" verde
2. Título "Show dos Números"
3. Campos de email e senha

Se ainda estiver em branco:
1. Abra o Console do Navegador (F12)
2. Procure por erros em vermelho
3. Verifique a aba "Network" se os recursos estão carregando

## 💡 Dica

Para desenvolvimento, use:
```bash
npm run dev
```

Isso inicia um servidor de desenvolvimento que recarrega automaticamente.
