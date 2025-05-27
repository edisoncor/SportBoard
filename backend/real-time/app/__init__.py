from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS en la aplicación
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)  # Inicializa Flask-Migrate con la base de datos

    from .routes import api  # Importar el Blueprint
    app.register_blueprint(api)  # Registrar el Blueprint

    return app
