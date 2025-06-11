# Configuração do Gunicorn para Railway
import os
import multiprocessing

# Obter porta do Railway ou usar padrão
port = int(os.environ.get('PORT', 8000))

# Configurações básicas
bind = f"0.0.0.0:{port}"
workers = 1  # Railway funciona melhor com 1 worker
worker_class = "sync"
worker_connections = 1000

# Configurações de timeout
timeout = 120  # Aumentar timeout para setup automático
keepalive = 2

# Configurações de restart
max_requests = 1000
max_requests_jitter = 100
preload_app = False  # Desabilitar preload para evitar problemas de setup

# Configurações de logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Configurações de segurança
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190 