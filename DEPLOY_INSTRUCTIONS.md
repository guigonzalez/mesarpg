# Instruções de Deploy - MesaRPG no Railway

## ✅ Problemas Corrigidos

1. **Procfile corrigido** - Agora usa configuração do Gunicorn
2. **Requirements.txt completo** - Todas as dependências incluídas
3. **Configuração Gunicorn otimizada** - Compatível com Railway
4. **Setup automático robusto** - Evita crashes no startup
5. **URL do PostgreSQL corrigida** - Suporte ao Railway
6. **Testes de deploy** - Script para verificar funcionamento

## 🚀 Deploy no Railway

### 1. Preparação

1. **Fork/Clone** o repositório para sua conta
2. **Conecte** o repositório ao Railway
3. **Configure** as variáveis de ambiente (veja abaixo)

### 2. Variáveis de Ambiente Obrigatórias

No Railway Dashboard, configure:

```
SECRET_KEY=sua_chave_secreta_muito_segura_aqui
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@mesarpg.com
ADMIN_PASSWORD=sua_senha_segura_aqui
```

**Nota:** O Railway configura automaticamente:
- `DATABASE_URL` (PostgreSQL)
- `PORT` (porta da aplicação)

### 3. Deploy Automático

O Railway fará o deploy automaticamente quando você fizer push para o repositório.

### 4. Verificação

1. **Acesse** a URL fornecida pelo Railway
2. **Verifique os logs** - deve aparecer:
   ```
   Iniciando setup automático...
   Tabelas criadas com sucesso!
   Usuário admin criado com sucesso!
   Setup automático executado com sucesso!
   ```
3. **Faça login** com as credenciais admin configuradas
4. **Acesse** `/admin/` para verificar o dashboard

## 🔧 Troubleshooting

### Problema: Deploy falha

**Solução 1:** Verifique se todas as variáveis estão configuradas
**Solução 2:** Verifique os logs do Railway para erros específicos
**Solução 3:** Execute setup manual no console do Railway:
```bash
python railway_setup.py
```

### Problema: Aplicação não responde

**Solução 1:** Verifique se o banco PostgreSQL foi criado
**Solução 2:** Reinicie o deploy
**Solução 3:** Verifique se a porta está configurada corretamente

### Problema: Usuário admin não existe

**Solução:** Execute no console do Railway:
```bash
python create_admin.py
```

## 📁 Arquivos de Configuração

- `Procfile` - Comando de inicialização
- `requirements.txt` - Dependências Python
- `gunicorn.conf.py` - Configuração do servidor
- `runtime.txt` - Versão do Python
- `railway.json` - Configuração do Railway
- `main.py` - Ponto de entrada da aplicação

## 🧪 Teste Local

Antes do deploy, execute o teste local:

```bash
python test_deploy.py
```

Todos os testes devem passar para garantir que o deploy funcionará.

## 📊 Monitoramento

Após o deploy, monitore:

1. **Logs** - Para erros e setup automático
2. **Health Check** - Status da aplicação
3. **Banco de Dados** - Conexão e tabelas
4. **Usuário Admin** - Login e acesso

## 🔄 Atualizações

Para atualizar a aplicação:

1. **Faça push** para o repositório
2. **Railway** fará deploy automático
3. **Verifique** se tudo está funcionando
4. **Teste** o login e funcionalidades

## 📞 Suporte

Se houver problemas:

1. **Verifique** os logs do Railway
2. **Execute** `python test_deploy.py` localmente
3. **Consulte** `RAILWAY_DEPLOY.md` para mais detalhes
4. **Execute** setup manual se necessário 