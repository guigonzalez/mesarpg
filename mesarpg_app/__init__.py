import os
import logging
from dotenv import load_dotenv

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Carregar variáveis de ambiente
load_dotenv()

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

# Configure logging
logging.basicConfig(level=logging.INFO)

def create_app():
    # create the app
    app = Flask(__name__)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # configure the database
    if os.getenv('DATABASE_URL'):
        # Produção (Railway) - ajustar URL para PostgreSQL
        database_url = os.getenv('DATABASE_URL')
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    else:
        # Desenvolvimento local
        app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///mesarpg.db'
    
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Flask-Login configuration
    app.config["LOGIN_VIEW"] = "auth.login"
    app.config["LOGIN_MESSAGE"] = "Por favor, faça login para acessar esta página."
    app.config["LOGIN_MESSAGE_CATEGORY"] = "info"

    # initialize extensions
    db.init_app(app)
    login_manager.init_app(app)

    # Import models and user loader
    from mesarpg_app.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from mesarpg_app.routes import main_bp, auth_bp, sessions_bp, profile_bp, masters_bp, campaign_bp, admin_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(sessions_bp, url_prefix='/sessions')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(masters_bp, url_prefix='/masters')
    app.register_blueprint(campaign_bp, url_prefix='/campaign')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    # Setup automático em produção (apenas uma vez)
    if os.getenv('DATABASE_URL') and not os.getenv('SETUP_COMPLETED'):
        with app.app_context():
            try:
                print("Iniciando setup automático...")
                
                # Criar tabelas se não existirem
                db.create_all()
                print("Tabelas criadas com sucesso!")
                
                # Importar e executar setup
                from setup_production import create_admin_user, create_default_systems
                
                # Criar admin e sistemas padrão
                create_admin_user()
                create_default_systems()
                
                # Marcar setup como completo
                os.environ['SETUP_COMPLETED'] = 'true'
                print("Setup automático executado com sucesso!")
                
            except Exception as e:
                print(f"Erro no setup automático: {str(e)}")
                # Não falhar a aplicação se o setup der erro
                pass

    return app

app = create_app() 