from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
migrate = Migrate()

# Para las migraciones
# flask db init
# flask db migrate -m "nombre de la migración"
# flask db upgrade
# docker-compose exec ms3-real-time flask db migrate && docker-compose exec ms3-real-time flask db upgrade
# flask db downgrade (revertir)

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)  # Habilitar CORS en la aplicación
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)  # Inicializa Flask-Migrate con la base de datos

    from .routes import real_time  # Importar el Blueprint
    app.register_blueprint(real_time)  # Registrar el Blueprint

    return app
