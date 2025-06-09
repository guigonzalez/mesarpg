# Configuração do Gunicorn para produção
import multiprocessing

# Configurações básicas
bind = "0.0.0.0:8000"
workers = 1
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