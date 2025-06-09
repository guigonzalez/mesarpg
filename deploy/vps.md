# Deploy em VPS (Ubuntu/Debian)

## 🖥️ Preparação do Servidor

### 1. Conectar ao VPS
```bash
ssh root@seu-servidor.com
```

### 2. Atualizar o sistema
```bash
apt update && apt upgrade -y
```

### 3. Instalar dependências
```bash
# Python e ferramentas
apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib -y

# Ferramentas de desenvolvimento
apt install git curl wget build-essential -y

# Instalar uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### 4. Configurar PostgreSQL
```bash
# Criar usuário e banco
sudo -u postgres createuser --interactive
# Digite: mesarpg
# Responda: y (superuser)

sudo -u postgres createdb mesarpg
sudo -u postgres psql -c "ALTER USER mesarpg PASSWORD 'sua-senha-segura';"
```

### 5. Criar usuário para a aplicação
```bash
adduser mesarpg
usermod -aG sudo mesarpg
su - mesarpg
```

## 📦 Deploy da Aplicação

### 1. Clonar o repositório
```bash
cd /home/mesarpg
git clone https://github.com/seu-usuario/mesarpg.git
cd mesarpg
```

### 2. Configurar ambiente virtual
```bash
uv venv
source .venv/bin/activate
uv sync
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
nano .env
```

Conteúdo do `.env`:
```env
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_SECRET=sua-chave-super-secreta-aqui
DATABASE_URL=postgresql://mesarpg:sua-senha-segura@localhost/mesarpg
```

### 4. Configurar Gunicorn
```bash
# Criar arquivo de configuração do Gunicorn
nano /home/mesarpg/mesarpg/gunicorn.conf.py
```

Conteúdo:
```python
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

### 5. Criar service do systemd
```bash
sudo nano /etc/systemd/system/mesarpg.service
```

Conteúdo:
```ini
[Unit]
Description=MesaRPG Flask Application
After=network.target

[Service]
User=mesarpg
Group=mesarpg
WorkingDirectory=/home/mesarpg/mesarpg
Environment="PATH=/home/mesarpg/mesarpg/.venv/bin"
ExecStart=/home/mesarpg/mesarpg/.venv/bin/gunicorn --config gunicorn.conf.py main:flask_app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

### 6. Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/mesarpg
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/mesarpg/mesarpg/mesarpg_app/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7. Ativar configurações
```bash
# Ativar site no Nginx
sudo ln -s /etc/nginx/sites-available/mesarpg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Iniciar aplicação
sudo systemctl daemon-reload
sudo systemctl enable mesarpg
sudo systemctl start mesarpg
```

### 8. Configurar SSL com Certbot
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## 🔧 Comandos Úteis

### Verificar status
```bash
sudo systemctl status mesarpg
sudo systemctl status nginx
```

### Ver logs
```bash
sudo journalctl -u mesarpg -f
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar aplicação
```bash
sudo systemctl restart mesarpg
```

### Atualizar código
```bash
cd /home/mesarpg/mesarpg
git pull
source .venv/bin/activate
uv sync
sudo systemctl restart mesarpg
```

## ✅ Vantagens
- **Controle total** sobre o servidor
- **Recursos dedicados**
- **Domínio personalizado**
- **SSL gratuito**
- **Escalabilidade**

## ⚠️ Considerações
- **Mais complexo** de configurar
- **Manutenção manual** necessária
- **Custo** do VPS
- **Responsabilidade** de segurança 