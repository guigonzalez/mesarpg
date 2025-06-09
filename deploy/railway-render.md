# Deploy no Railway ou Render

## 🚀 Railway (Recomendado)

### 1. Preparação
```bash
# Certifique-se de que o projeto está no GitHub
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### 2. Deploy no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório MesaRPG
5. Railway detectará automaticamente que é um projeto Python

### 3. Configurar Variáveis de Ambiente
No Railway, vá em "Variables" e adicione:
```env
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_SECRET=sua-chave-super-secreta-aqui
DATABASE_URL=postgresql://...  # Railway fornece automaticamente
```

### 4. Configurar Build
Railway usa automaticamente o `pyproject.toml`, mas você pode adicionar um `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "uv sync"

[deploy]
startCommand = "gunicorn --bind 0.0.0.0:$PORT main:flask_app"
healthcheckPath = "/"
healthcheckTimeout = 300
```

---

## 🌐 Render

### 1. Preparação
```bash
# Mesmo processo do Railway
git push origin main
```

### 2. Deploy no Render
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New" → "Web Service"
4. Conecte seu repositório MesaRPG

### 3. Configurações do Render
- **Name**: mesarpg
- **Environment**: Python 3
- **Build Command**: `uv sync`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:flask_app`
- **Plan**: Free (ou pago para mais recursos)

### 4. Variáveis de Ambiente
No Render, vá em "Environment" e adicione:
```env
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_SECRET=sua-chave-super-secreta-aqui
```

### 5. Banco de Dados (Opcional)
No Render, crie um "PostgreSQL" service e conecte ao seu web service.

---

## ✅ Vantagens
- **Gratuito** para começar
- **Deploy automático** do GitHub
- **SSL automático**
- **Fácil configuração**
- **Suporte a PostgreSQL**

## ⚠️ Limitações
- **Recursos limitados** no plano gratuito
- **Sleep mode** no plano gratuito (primeira requisição pode ser lenta)
- **Sem domínio personalizado** no plano gratuito 