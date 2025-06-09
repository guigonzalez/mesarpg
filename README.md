# MesaRPG

Uma plataforma web para conectar jogadores e mestres de RPG de mesa, facilitando a organização de sessões, gerenciamento de campanhas e interação entre participantes.

## 🎲 Funcionalidades

- **Sistema de Usuários**: Registro e login com perfis personalizáveis
- **Gerenciamento de Sessões**: Criação, edição e busca de sessões de RPG
- **Sistema de Inscrições**: Jogadores podem se inscrever em sessões
- **Chat em Tempo Real**: Comunicação durante as sessões
- **Fichas de Personagem**: Criação e gerenciamento de personagens
- **Diário de Campanha**: Registro de eventos e notas da campanha
- **Sistema de Avaliações**: Avaliação de mestres e jogadores
- **Interface Responsiva**: Design moderno e acessível

## 🚀 Tecnologias

- **Backend**: Flask (Python)
- **Banco de Dados**: SQLAlchemy (SQLite/PostgreSQL)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Autenticação**: Flask-Login
- **Formulários**: Flask-WTF, WTForms
- **Gerenciador de Pacotes**: uv
- **Servidor WSGI**: Gunicorn

## 📋 Pré-requisitos

- Python 3.11+
- uv (gerenciador de pacotes Python)
- Git

## 🛠️ Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/mesarpg.git
cd mesarpg
```

### 2. Criar ambiente virtual
```bash
uv venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate     # Windows
```

### 3. Instalar dependências
```bash
uv sync
```

### 4. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 5. Executar a aplicação
```bash
python main.py
```

A aplicação estará disponível em: http://localhost:5001

## 🚀 Deploy

Temos guias completos para diferentes opções de deploy:

### 🎯 Recomendações por perfil:

- **🚀 Iniciantes/MVP**: [Railway ou Render](./deploy/railway-render.md) - Gratuito e fácil
- **🖥️ Controle total**: [VPS Tradicional](./deploy/vps.md) - Máximo controle
- **🐳 Escalabilidade**: [Docker](./deploy/docker.md) - Containerização

### 📚 Guias completos:
- [Guia Principal de Deploy](./deploy/README.md) - Visão geral de todas as opções
- [Configurações de Produção](./deploy/production-config.md) - Arquivos de configuração

## 🏗️ Estrutura do Projeto

```
mesarpg/
├── mesarpg_app/           # Pacote principal da aplicação
│   ├── __init__.py        # Configuração do Flask
│   ├── models.py          # Modelos do banco de dados
│   ├── routes.py          # Rotas da aplicação
│   ├── forms.py           # Formulários
│   ├── templates/         # Templates HTML
│   └── static/            # Arquivos estáticos (CSS, JS, imagens)
├── deploy/                # Guias de deploy
├── tests/                 # Testes automatizados
├── attached_assets/       # Documentação e recursos
├── main.py               # Ponto de entrada da aplicação
├── pyproject.toml        # Dependências e configurações
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Orquestração Docker
└── gunicorn.conf.py      # Configuração Gunicorn
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Flask
FLASK_ENV=development
FLASK_DEBUG=True
SESSION_SECRET=sua-chave-super-secreta-aqui

# Banco de dados
DATABASE_URL=sqlite:///mesarpg.db

# Configurações de segurança
SECRET_KEY=sua-chave-super-secreta-aqui
WTF_CSRF_SECRET_KEY=outra-chave-super-secreta-aqui
```

### Banco de Dados

A aplicação usa SQLAlchemy com suporte a SQLite (desenvolvimento) e PostgreSQL (produção).

## 🧪 Testes

```bash
# Executar testes
python -m pytest tests/

# Executar com cobertura
python -m pytest tests/ --cov=mesarpg_app
```

## 📝 Desenvolvimento

### Comandos úteis:

```bash
# Ativar ambiente virtual
source .venv/bin/activate

# Instalar novas dependências
uv add nome-do-pacote

# Atualizar dependências
uv sync

# Executar aplicação em modo debug
python main.py

# Verificar logs
tail -f logs/app.log
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/mesarpg/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/mesarpg/wiki)
- **Deploy**: [Guias de Deploy](./deploy/README.md)

## 🎉 Agradecimentos

- Comunidade Flask
- Contribuidores do projeto
- Testadores e usuários

---

**MesaRPG** - Conectando jogadores e mestres de RPG de mesa! 🎲✨ 