import os
import logging

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

def create_app():
    # create the app
    app = Flask(__name__)
    app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # configure the database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///mesarpg.db")
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    
    # Flask-Login configuration
    app.config["LOGIN_VIEW"] = "auth.login"
    app.config["LOGIN_MESSAGE"] = "Por favor, faça login para acessar esta página."
    app.config["LOGIN_MESSAGE_CATEGORY"] = "info"

    # initialize extensions
    db.init_app(app)
    login_manager.init_app(app)

    # Import models and user loader
    from models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from routes import main_bp, auth_bp, sessions_bp, profile_bp, masters_bp, campaign_bp, notifications_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(sessions_bp, url_prefix='/sessions')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(masters_bp, url_prefix='/masters')
    app.register_blueprint(campaign_bp, url_prefix='/campaign')
    app.register_blueprint(notifications_bp, url_prefix='/notifications')

    with app.app_context():
        # Import all models to ensure tables are created
        import models  # noqa: F401
        db.create_all()

    return app

app = create_app()
