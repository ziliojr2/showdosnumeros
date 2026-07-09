# 🐛 Como Debugar Página Branca

Se a página ainda está em branco mesmo após publicar no GitHub, siga estes passos para identificar o erro:

## 📋 Passo 1: Abrir Console do Navegador

1. Abra a página no navegador
2. Pressione **F12** (ou Ctrl+Shift+I / Cmd+Option+I no Mac)
3. Clique na aba **Console**

## 🔍 Passo 2: Identificar o Erro

Procure por mensagens em **vermelho** no console. Os erros mais comuns são:

### ❌ "Failed to load module script"
**Causa:** Servidor não está configurando MIME type correto

**Solução:**
- GitHub Pages: Adicione um arquivo `.nojekyll` na raiz do repositório
- Netlify/Vercel: Geralmente funciona automaticamente

### ❌ "Uncaught SyntaxError" ou "Unexpected token"
**Causa:** Erro de sintaxe no JavaScript

**Solução:**
- Verifique se o build foi feito corretamente
- Tente: `npm run build` novamente

### ❌ "TypeError: Cannot read property 'X' of undefined"
**Causa:** Erro no código React

**Solução:**
- O ErrorBoundary deve mostrar a mensagem de erro
- Copie o erro e envie para análise

### ❌ "net::ERR_FAILED" ou "CORS policy"
**Causa:** Problema de CORS ou rede

**Solução:**
- Verifique se todos os arquivos foram publicados
- Tente outro navegador

## 🛠️ Passo 3: Testar Localmente

Antes de publicar, teste localmente:

```bash
# Instale serve se não tiver
npm install -g serve

# Sirva a pasta dist
serve dist

# Abra no navegador
# http://localhost:3000
```

Se funcionar localmente mas não no GitHub, o problema é na configuração do GitHub Pages.

## 📦 Passo 4: Verificar Arquivos Publicados

No GitHub, verifique se estes arquivos existem:
- ✅ `index.html`
- ✅ Tamanho: ~1MB (deve ter todo o código embutido)

## 🔧 Passo 5: Configuração do GitHub Pages

1. Vá em **Settings** do repositório
2. Clique em **Pages**
3. Em **Source**, selecione:
   - Branch: `main` (ou `master`)
   - Folder: `/ (root)` ou `/docs`

4. Se estiver usando pasta `/docs`:
   - Mova o conteúdo de `dist` para `docs`
   - Commit e push

## 📝 Passo 6: Adicionar .nojekyll

Crie um arquivo vazio chamado `.nojekyll` na raiz do repositório:

```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll"
git push
```

Isso impede o GitHub de processar o site com Jekyll.

## 🎯 Passo 7: Verificar URL Correta

A URL do GitHub Pages deve ser:
```
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

Exemplo:
```
https://joaosilva.github.io/show-dos-numeros/
```

## 🔬 Passo 8: Teste com URL Direta

Tente abrir o `index.html` diretamente:
```
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/index.html
```

## 💡 Dicas Adicionais

### Limpar Cache do Navegador
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Ou use modo anônimo (Ctrl+Shift+N)

### Testar em Outro Navegador
- Firefox geralmente é mais permissivo
- Teste em Chrome, Firefox, Edge, Safari

### Verificar Rede
Na aba **Network** do DevTools:
- Recarregue a página (Ctrl+R)
- Veja se algum arquivo falhou ao carregar (status vermelho)
- Clique no arquivo para ver detalhes do erro

## 📞 Precisa de Ajuda?

Se nada funcionar:

1. **Tire um screenshot** do Console (F12) com o erro
2. **Tire um screenshot** da aba Network
3. **Informe:**
   - URL do GitHub Pages
   - Navegador e versão
   - Sistema operacional
   - Mensagens de erro do Console

## ✅ Checklist de Publicação

- [ ] Build feito: `npm run build`
- [ ] Pasta `dist` contém `index.html` (~1MB)
- [ ] Arquivo `.nojekyll` criado na raiz
- [ ] GitHub Pages configurado (Settings > Pages)
- [ ] Commit e push feitos
- [ ] Aguardou 1-2 minutos para GitHub processar
- [ ] URL acessada: `https://usuario.github.io/repositorio/`
- [ ] Console verificado (F12)
- [ ] Cache limpo ou modo anônimo usado

## 🚀 Alternativa: Netlify

Se GitHub Pages continuar com problema, use Netlify:

1. Acesse: https://app.netlify.com
2. Faça login com GitHub
3. Clique em "New site from Git"
4. Selecione seu repositório
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

Netlify configura tudo automaticamente e geralmente funciona sem problemas.
