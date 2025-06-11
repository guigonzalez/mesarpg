# Deploy no Railway - MesaRPG (Versão Corrigida)

## Problemas Corrigidos

✅ **Procfile corrigido** - Agora usa configuração do Gunicorn  
✅ **Requirements.txt completo** - Todas as dependências incluídas  
✅ **Configuração Gunicorn otimizada** - Compatível com Railway  
✅ **Setup automático robusto** - Evita crashes no startup  
✅ **URL do PostgreSQL corrigida** - Suporte ao Railway  

## Configuração Inicial

### 1. Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis de ambiente no Railway:

```
SECRET_KEY=sua_chave_secreta_muito_segura_aqui
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@mesarpg.com
ADMIN_PASSWORD=sua_senha_segura_aqui
```

**Nota:** O Railway configura automaticamente `DATABASE_URL` e `PORT`.

### 2. Deploy Automático

O sistema agora tem setup automático melhorado que:
- Executa apenas uma vez por deploy
- Não falha a aplicação se houver erro
- Aguarda o banco estar pronto
- Usa logging mais informativo

### 3. Setup Manual (se necessário)

Se o setup automático não funcionar, execute no console do Railway:

```bash
python railway_setup.py
```

## Verificação do Deploy

1. **Acesse a aplicação** após o deploy
2. **Verifique os logs** - deve aparecer "Setup automático executado com sucesso!"
3. **Faça login** com as credenciais admin configuradas
4. **Verifique o menu "Admin"** no cabeçalho
5. **Acesse `/admin/`** para verificar o dashboard administrativo

## Troubleshooting

### Problema: Aplicação não inicia

**Solução:** Verifique se todas as variáveis de ambiente estão configuradas:
- `SECRET_KEY` (obrigatória)
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (obrigatórias)
- `DATABASE_URL` (configurada automaticamente pelo Railway)

### Problema: Erro de conexão com banco

**Solução 1:** Reinicie o deploy
**Solução 2:** Verifique se o Railway criou o banco PostgreSQL
**Solução 3:** Execute setup manual: `python railway_setup.py`

### Problema: Usuário admin não foi criado

**Solução 1:** Execute setup manual
```bash
python railway_setup.py
```

**Solução 2:** Verifique as variáveis de ambiente no Railway Dashboard

### Problema: Sistemas padrão não foram criados

Execute o script de setup completo:

```bash
python setup_production.py
```

## Logs Úteis

Para verificar se o deploy funcionou, procure nos logs:

```
Iniciando setup automático...
Tabelas criadas com sucesso!
Usuário admin criado com sucesso!
Sistema D&D 5e criado com sucesso!
Sistema Call of Cthulhu criado com sucesso!
Setup automático executado com sucesso!
```

## Estrutura de Arquivos Atualizada

- `Procfile` - Configuração corrigida do Gunicorn
- `requirements.txt` - Dependências completas
- `gunicorn.conf.py` - Configuração otimizada para Railway
- `mesarpg_app/__init__.py` - Setup automático robusto
- `railway_setup.py` - Script de setup melhorado
- `setup_production.py` - Script principal de setup

## Configurações Técnicas

### Gunicorn
- **Workers:** 1 (otimizado para Railway)
- **Timeout:** 120s (para setup automático)
- **Preload:** False (evita problemas de setup)
- **Porta:** Automática via variável `PORT`

### Banco de Dados
- **URL:** Ajustada automaticamente para PostgreSQL
- **Pool:** Configurado para conexões estáveis
- **Pre-ping:** Habilitado para verificar conexões

### Setup Automático
- **Execução:** Apenas uma vez por deploy
- **Fallback:** Não falha a aplicação se der erro
- **Logging:** Informações detalhadas para debug 