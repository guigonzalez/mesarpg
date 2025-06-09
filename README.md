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
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Autenticação**: Flask-Login
- **Formulários**: WTForms
- **Gerenciador de Pacotes**: uv

## 📋 Pré-requisitos

- Python 3.11 ou superior
- uv (gerenciador de pacotes Python)

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd mesarpg
   ```

2. **Crie e ative o ambiente virtual**
   ```bash
   uv venv
   source .venv/bin/activate  # Linux/macOS
   # ou
   .venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências**
   ```bash
   uv sync
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

5. **Execute a aplicação**
   ```bash
   python main.py
   ```

A aplicação estará disponível em `http://localhost:5001`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Flask
FLASK_ENV=development
FLASK_DEBUG=True

# Chave secreta para sessões (ALTERE EM PRODUÇÃO!)
SESSION_SECRET=sua-chave-secreta-muito-segura-aqui

# Configuração do banco de dados
DATABASE_URL=sqlite:///mesarpg.db
```

### Banco de Dados

Por padrão, a aplicação usa SQLite para desenvolvimento. Para produção, recomenda-se PostgreSQL:

```env
DATABASE_URL=postgresql://usuario:senha@localhost/mesarpg
```

## 📁 Estrutura do Projeto

```
mesarpg/
├── app/                    # Pacote principal da aplicação
│   ├── __init__.py        # Configuração da aplicação Flask
│   ├── models.py          # Modelos do banco de dados
│   ├── forms.py           # Formulários WTForms
│   ├── routes.py          # Rotas da aplicação
│   ├── templates/         # Templates HTML
│   └── static/            # Arquivos estáticos (CSS, JS, imagens)
├── main.py                # Ponto de entrada da aplicação
├── pyproject.toml         # Configurações do projeto e dependências
├── uv.lock               # Lock file das dependências
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
└── README.md             # Este arquivo
```

## 🎮 Como Usar

### Para Jogadores

1. **Criar conta**: Registre-se como jogador
2. **Buscar sessões**: Explore sessões disponíveis
3. **Se inscrever**: Candidate-se às sessões de interesse
4. **Participar**: Use o chat e ferramentas durante a sessão

### Para Mestres

1. **Criar conta**: Registre-se como mestre
2. **Criar sessões**: Publique suas sessões de RPG
3. **Gerenciar candidatos**: Aprove ou rejeite inscrições
4. **Conduzir sessões**: Use as ferramentas de mestre

## 🔧 Desenvolvimento

### Executar em modo de desenvolvimento

```bash
python main.py
```

### Executar com recarregamento automático

```bash
uv run --reload main.py
```

### Executar testes (quando implementados)

```bash
uv run pytest
```

## 🚀 Deploy

### Usando Gunicorn (Produção)

```bash
gunicorn --bind 0.0.0.0:5000 main:app
```

### Variáveis de ambiente para produção

```env
FLASK_ENV=production
FLASK_DEBUG=False
SESSION_SECRET=chave-super-secreta-de-producao
DATABASE_URL=postgresql://usuario:senha@localhost/mesarpg
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no GitHub ou entre em contato através do email do projeto.

---

**MesaRPG** - Conectando jogadores e mestres de RPG de mesa! 🎲✨ 