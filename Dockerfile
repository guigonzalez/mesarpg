# Dockerfile para MesaRPG
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