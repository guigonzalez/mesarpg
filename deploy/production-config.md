# Configurações para Produção

## 🔧 Arquivos de Configuração

### 1. .env.example (Template)
```env
# Configurações do Flask
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_SECRET=sua-chave-super-secreta-aqui

# Banco de dados
DATABASE_URL=postgresql://usuario:senha@localhost/mesarpg

# Configurações de email (opcional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app

# Configurações de segurança
SECRET_KEY=sua-chave-super-secreta-aqui
WTF_CSRF_SECRET_KEY=outra-chave-super-secreta-aqui

# Configurações de upload (opcional)
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=uploads
```

### 2. gunicorn.conf.py
```python
# Configuração do Gunicorn para produção
import multiprocessing

# Configurações básicas
bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000

# Configurações de timeout
timeout = 30
keepalive = 2

# Configurações de restart
max_requests = 1000
max_requests_jitter = 100
preload_app = True

# Configurações de logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Configurações de segurança
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
```

### 3. nginx.conf (Produção)
```nginx
# Configuração do Nginx para produção
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Configurações básicas
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;

    # Configurações de gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Configurações de segurança
    server_tokens off;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Upstream para Flask
    upstream flask_app {
        server 127.0.0.1:8000;
    }

    # Servidor HTTP (redirecionamento para HTTPS)
    server {
        listen 80;
        server_name seu-dominio.com www.seu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    # Servidor HTTPS
    server {
        listen 443 ssl http2;
        server_name seu-dominio.com www.seu-dominio.com;

        # Certificados SSL
        ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

        # Configurações SSL
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Configurações de segurança adicionais
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Proxy para Flask
        location / {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Arquivos estáticos
        location /static {
            alias /home/mesarpg/mesarpg/mesarpg_app/static;
            expires 30d;
            add_header Cache-Control "public, immutable";
            add_header Vary Accept-Encoding;
        }

        # Favicon
        location = /favicon.ico {
            alias /home/mesarpg/mesarpg/mesarpg_app/static/favicon.ico;
            access_log off;
            log_not_found off;
        }

        # Robots.txt
        location = /robots.txt {
            alias /home/mesarpg/mesarpg/mesarpg_app/static/robots.txt;
            access_log off;
            log_not_found off;
        }
    }
}
```

### 4. systemd service (mesarpg.service)
```ini
[Unit]
Description=MesaRPG Flask Application
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=notify
User=mesarpg
Group=mesarpg
WorkingDirectory=/home/mesarpg/mesarpg
Environment="PATH=/home/mesarpg/mesarpg/.venv/bin"
Environment="FLASK_ENV=production"
Environment="FLASK_DEBUG=False"
ExecStart=/home/mesarpg/mesarpg/.venv/bin/gunicorn --config gunicorn.conf.py main:flask_app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=5
StartLimitInterval=0

# Configurações de segurança
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/home/mesarpg/mesarpg
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

[Install]
WantedBy=multi-user.target
```

### 5. Script de deploy (deploy.sh)
```bash
#!/bin/bash

# Script de deploy para MesaRPG
set -e

echo "🚀 Iniciando deploy do MesaRPG..."

# Configurações
APP_DIR="/home/mesarpg/mesarpg"
SERVICE_NAME="mesarpg"
BRANCH="main"

# Função de log
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Backup do banco
log "📦 Fazendo backup do banco de dados..."
sudo -u postgres pg_dump mesarpg > "$APP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# Atualizar código
log "📥 Atualizando código..."
cd "$APP_DIR"
git fetch origin
git reset --hard origin/$BRANCH

# Atualizar dependências
log "📦 Atualizando dependências..."
source .venv/bin/activate
uv sync

# Aplicar migrações (se houver)
log "🗄️ Aplicando migrações..."
# python manage.py db upgrade  # Descomente se usar Flask-Migrate

# Reiniciar serviço
log "🔄 Reiniciando serviço..."
sudo systemctl restart $SERVICE_NAME

# Verificar status
log "✅ Verificando status..."
sleep 5
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    log "✅ Deploy concluído com sucesso!"
else
    log "❌ Erro no deploy. Verifique os logs:"
    sudo journalctl -u $SERVICE_NAME -n 50
    exit 1
fi

# Limpar backups antigos (manter apenas os últimos 7 dias)
log "🧹 Limpando backups antigos..."
find "$APP_DIR" -name "backup_*.sql" -mtime +7 -delete

log "🎉 Deploy finalizado!"
```

### 6. Script de monitoramento (monitor.sh)
```bash
#!/bin/bash

# Script de monitoramento para MesaRPG
APP_DIR="/home/mesarpg/mesarpg"
SERVICE_NAME="mesarpg"
DOMAIN="seu-dominio.com"

# Verificar status do serviço
check_service() {
    if systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ Serviço $SERVICE_NAME está rodando"
    else
        echo "❌ Serviço $SERVICE_NAME está parado"
        systemctl restart $SERVICE_NAME
    fi
}

# Verificar uso de disco
check_disk() {
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        echo "⚠️ Uso de disco alto: ${DISK_USAGE}%"
    else
        echo "✅ Uso de disco OK: ${DISK_USAGE}%"
    fi
}

# Verificar uso de memória
check_memory() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    echo "💾 Uso de memória: ${MEMORY_USAGE}%"
}

# Verificar conectividade
check_connectivity() {
    if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
        echo "✅ Site está respondendo"
    else
        echo "❌ Site não está respondendo"
    fi
}

# Executar verificações
echo "🔍 Verificando MesaRPG..."
check_service
check_disk
check_memory
check_connectivity
```

## 🔐 Configurações de Segurança

### 1. Firewall (UFW)
```bash
# Configurar firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Fail2ban
```bash
# Instalar Fail2ban
sudo apt install fail2ban -y

# Configurar para Nginx
sudo nano /etc/fail2ban/jail.local
```

Conteúdo:
```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
```

### 3. Configurações do PostgreSQL
```bash
# Editar postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Adicionar:
```ini
# Configurações de segurança
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 128MB
effective_cache_size = 512MB
```

## 📊 Monitoramento

### 1. Logrotate
```bash
# Configurar rotação de logs
sudo nano /etc/logrotate.d/mesarpg
```

Conteúdo:
```
/home/mesarpg/mesarpg/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 mesarpg mesarpg
    postrotate
        systemctl reload mesarpg
    endscript
}
```

### 2. Backup automático
```bash
# Adicionar ao crontab
sudo crontab -e
```

Adicionar:
```bash
# Backup diário às 2h da manhã
0 2 * * * /home/mesarpg/mesarpg/scripts/backup.sh

# Monitoramento a cada 5 minutos
*/5 * * * * /home/mesarpg/mesarpg/scripts/monitor.sh
``` 