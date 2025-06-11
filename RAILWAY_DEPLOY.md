# Deploy no Railway - MesaRPG

## Configuração Inicial

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Railway:

```
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@mesarpg.com
ADMIN_PASSWORD=sua_senha_segura_aqui
SECRET_KEY=sua_chave_secreta_aqui
```

### 2. Deploy Automático

O sistema agora tem setup automático que executa no startup da aplicação. O usuário admin será criado automaticamente se não existir.

### 3. Setup Manual (se necessário)

Se o setup automático não funcionar, execute no console do Railway:

```bash
python railway_setup.py
```

Ou execute diretamente:

```bash
python setup_production.py
```

## Verificação

1. Acesse a aplicação após o deploy
2. Faça login com as credenciais admin configuradas
3. Verifique se o menu "Admin" aparece no cabeçalho
4. Acesse `/admin/` para verificar o dashboard administrativo

## Troubleshooting

### Problema: Usuário admin não foi criado

**Solução 1:** Execute o setup manual
```bash
python railway_setup.py
```

**Solução 2:** Verifique as variáveis de ambiente
- Certifique-se de que `ADMIN_USERNAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão configuradas
- Verifique se `DATABASE_URL` está definida automaticamente pelo Railway

**Solução 3:** Crie admin via console Python
```bash
python
```

```python
from mesarpg_app import create_app, db
from mesarpg_app.models import User
from datetime import datetime

app = create_app()
with app.app_context():
    admin = User(
        username='admin',
        email='admin@mesarpg.com',
        role='admin',
        is_active=True,
        created_at=datetime.utcnow()
    )
    admin.set_password('sua_senha')
    db.session.add(admin)
    db.session.commit()
    print("Admin criado!")
```

### Problema: Sistemas padrão não foram criados

Execute o script de setup completo:

```bash
python setup_production.py
```

### Problema: Erro de conexão com banco

1. Verifique se o Railway criou automaticamente a variável `DATABASE_URL`
2. Reinicie o deploy se necessário
3. Verifique os logs do Railway para erros específicos

## Logs Úteis

Para verificar se o setup automático funcionou, verifique os logs do Railway. Você deve ver mensagens como:

```
Setup automático executado com sucesso!
Usuário admin criado com sucesso!
Sistema D&D 5e criado com sucesso!
Sistema Call of Cthulhu criado com sucesso!
```

## Estrutura de Arquivos

- `setup_production.py` - Script principal de setup
- `railway_setup.py` - Script específico para Railway
- `mesarpg_app/__init__.py` - Setup automático no startup
- `RAILWAY_DEPLOY.md` - Este arquivo de instruções 