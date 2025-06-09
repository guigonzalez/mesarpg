# 🚀 Guia de Deploy - MesaRPG

Este diretório contém guias completos para fazer o deploy do MesaRPG em diferentes ambientes.

## 📋 Opções de Deploy

### 1. **🚀 Deploy Simples (Recomendado para iniciantes)**
- **Railway** ou **Render** - Plataformas gratuitas e fáceis
- Deploy automático do GitHub
- SSL automático
- Banco PostgreSQL incluído
- **Tempo estimado**: 15-30 minutos

📖 [Guia Railway/Render](./railway-render.md)

### 2. **🖥️ VPS Tradicional (Mais controle)**
- Deploy em VPS Ubuntu/Debian
- Nginx + Gunicorn + PostgreSQL
- Controle total sobre o servidor
- **Tempo estimado**: 1-2 horas

📖 [Guia VPS](./vps.md)

### 3. **🐳 Docker (Containerização)**
- Deploy com Docker e Docker Compose
- Isolamento completo da aplicação
- Fácil escalabilidade
- **Tempo estimado**: 30-60 minutos

📖 [Guia Docker](./docker.md)

## 🎯 Recomendação por Perfil

### **Para iniciantes ou MVP:**
✅ **Railway** - Gratuito, fácil, rápido

### **Para projetos em crescimento:**
✅ **Render** - Mais recursos, ainda fácil

### **Para controle total:**
✅ **VPS** - Máximo controle, responsabilidade total

### **Para escalabilidade:**
✅ **Docker** - Fácil escalabilidade, isolamento

## 🔧 Pré-requisitos

### Para todos os deploys:
- ✅ Projeto no GitHub
- ✅ Código funcionando localmente
- ✅ Variáveis de ambiente configuradas

### Para VPS:
- ✅ Servidor Ubuntu/Debian
- ✅ Acesso SSH
- ✅ Domínio (opcional, mas recomendado)

### Para Docker:
- ✅ Docker instalado
- ✅ Docker Compose instalado

## 📝 Checklist de Deploy

### Antes do Deploy:
- [ ] Código testado localmente
- [ ] Todas as dependências no `pyproject.toml`
- [ ] Variáveis de ambiente definidas
- [ ] Banco de dados configurado
- [ ] SSL/HTTPS configurado
- [ ] Backup configurado

### Após o Deploy:
- [ ] Aplicação respondendo
- [ ] Banco de dados conectado
- [ ] SSL funcionando
- [ ] Logs sem erros
- [ ] Monitoramento ativo
- [ ] Backup funcionando

## 🔐 Segurança

### Configurações essenciais:
- [ ] Chaves secretas seguras
- [ ] Firewall configurado
- [ ] SSL/HTTPS ativo
- [ ] Headers de segurança
- [ ] Rate limiting
- [ ] Fail2ban (VPS)

## 📊 Monitoramento

### Ferramentas recomendadas:
- **Uptime Robot** - Monitoramento de uptime
- **Sentry** - Monitoramento de erros
- **Logs** - Monitoramento de logs
- **Métricas** - CPU, memória, disco

## 🆘 Troubleshooting

### Problemas comuns:

#### Aplicação não inicia:
```bash
# Verificar logs
docker-compose logs web  # Docker
sudo journalctl -u mesarpg -f  # VPS
```

#### Banco não conecta:
```bash
# Verificar variáveis de ambiente
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL
```

#### SSL não funciona:
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew
```

## 📞 Suporte

### Se precisar de ajuda:
1. Verifique os logs da aplicação
2. Consulte a documentação específica do método escolhido
3. Verifique as configurações de rede/firewall
4. Teste localmente antes do deploy

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. **Configurar domínio personalizado** (se aplicável)
2. **Configurar monitoramento**
3. **Configurar backup automático**
4. **Configurar CI/CD** para deploy automático
5. **Otimizar performance**
6. **Configurar analytics**

---

## 📚 Documentação Adicional

- [Configurações de Produção](./production-config.md)
- [Guia de Segurança](./security.md) *(em breve)*
- [Guia de Performance](./performance.md) *(em breve)*
- [Guia de CI/CD](./ci-cd.md) *(em breve)* 