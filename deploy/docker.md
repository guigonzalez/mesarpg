# Deploy com Docker

## 🐳 Preparação

### 1. Criar Dockerfile
```dockerfile
# Dockerfile
FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Instalar uv
RUN pip install uv

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY pyproject.toml uv.lock ./

# Instalar dependências
RUN uv sync --frozen

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 5000

# Comando para executar
CMD ["uv", "run", "gunicorn", "--bind", "0.0.0.0:5000", "main:flask_app"]
```

### 2. Criar docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=False
      - SESSION_SECRET=sua-chave-super-secreta-aqui
      - DATABASE_URL=postgresql://mesarpg:password@db:5432/mesarpg
    depends_on:
      - db
    volumes:
      - ./mesarpg_app/static:/app/mesarpg_app/static
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mesarpg
      - POSTGRES_USER=mesarpg
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Criar nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream flask_app {
        server web:5000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /static {
            proxy_pass http://flask_app;
        }
    }
}
```

### 4. Criar .dockerignore
```
.venv/
__pycache__/
*.pyc
.env
.git/
.gitignore
README.md
deploy/
attached_assets/
tests/
```

## 🚀 Deploy Local

### 1. Construir e executar
```bash
# Construir imagens
docker-compose build

# Executar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f web
```

### 2. Verificar status
```bash
docker-compose ps
```

### 3. Parar serviços
```bash
docker-compose down
```

## 🌐 Deploy em Produção

### 1. VPS com Docker
```bash
# Instalar Docker no servidor
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clonar repositório
git clone https://github.com/seu-usuario/mesarpg.git
cd mesarpg

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Executar
docker-compose up -d
```

### 2. Configurar SSL com Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot -y

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Atualizar nginx.conf para SSL
```

### 3. Atualizar nginx.conf com SSL
```nginx
events {
    worker_connections 1024;
}

http {
    upstream flask_app {
        server web:5000;
    }

    server {
        listen 80;
        server_name seu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name seu-dominio.com;

        ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

        location / {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /static {
            proxy_pass http://flask_app;
        }
    }
}
```

### 4. Atualizar docker-compose.yml para SSL
```yaml
version: '3.8'

services:
  web:
    build: .
    expose:
      - "5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=False
      - SESSION_SECRET=sua-chave-super-secreta-aqui
      - DATABASE_URL=postgresql://mesarpg:password@db:5432/mesarpg
    depends_on:
      - db
    volumes:
      - ./mesarpg_app/static:/app/mesarpg_app/static
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mesarpg
      - POSTGRES_USER=mesarpg
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - web
    restart: unless-stopped

volumes:
  postgres_data:
```

## 🔧 Comandos Úteis

### Atualizar aplicação
```bash
git pull
docker-compose build web
docker-compose up -d web
```

### Ver logs
```bash
docker-compose logs -f web
docker-compose logs -f nginx
```

### Backup do banco
```bash
docker-compose exec db pg_dump -U mesarpg mesarpg > backup.sql
```

### Restaurar backup
```bash
docker-compose exec -T db psql -U mesarpg mesarpg < backup.sql
```

## ✅ Vantagens
- **Isolamento** completo da aplicação
- **Consistência** entre ambientes
- **Fácil escalabilidade**
- **Portabilidade**
- **Versionamento** de dependências

## ⚠️ Considerações
- **Curva de aprendizado** do Docker
- **Overhead** de recursos
- **Complexidade** adicional
- **Debugging** mais complexo 