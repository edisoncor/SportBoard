# Importa la clase AppConfig y la función apps para la configuración y descubrimiento de aplicaciones en Django.
from django.apps import apps, AppConfig
# Importa el objeto settings para acceder a la configuración global de Django.
from django.conf import settings
# Importa el módulo os para la manipulación de variables de entorno.
import os
# Importa la clase Celery para la gestión de tareas asíncronas.
from celery import Celery
# Importa config de decouple para la gestión de variables de entorno desde archivos .env.
from decouple import config

# Si la configuración de Django no está inicializada, se configura el entorno según la variable ENVIRONMENT.
if not settings.configured:
    environment = config('ENVIRONMENT')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', "core.settings."+environment) 

# Inicializa la instancia principal de Celery para el proyecto core.
APP = Celery('core')


# Definición de la configuración personalizada de Celery como una AppConfig de Django.
class CeleryConfig(AppConfig):
    name = 'core'  # Nombre de la aplicación para la configuración de Celery.
    verbose_name = 'Celery Config'  # Nombre descriptivo para la configuración.

    def ready(self):
        # Configura Celery usando la configuración de Django bajo el namespace 'CELERY'.
        APP.config_from_object('django.conf:settings', namespace='CELERY')
        # Descubre automáticamente las tareas en todas las aplicaciones instaladas.
        installed_apps = [app_config.name for app_config in apps.get_app_configs()]
        APP.autodiscover_tasks(installed_apps, force=True)

    def tearDown(self):
        # Método de limpieza (actualmente vacío, reservado para futuras implementaciones).
        pass
