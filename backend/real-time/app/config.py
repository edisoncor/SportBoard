class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'mi_clave_secreta'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://my_user:my_password@mariadb-real-time:3306/my_database'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
