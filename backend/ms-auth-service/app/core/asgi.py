"""
ASGI config for lms project.

Este archivo configura la interfaz ASGI para el proyecto LMS (Learning Management System), permitiendo la ejecución de la aplicación en servidores compatibles con ASGI.

Expone la variable de aplicación ASGI a nivel de módulo como ``application``.

Para más información sobre este archivo, consulta:
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

# Importa el módulo os para la manipulación de variables de entorno.
import os
# Importa config de decouple para la gestión de variables de entorno desde archivos .env.
from decouple import config
# Importa la función get_asgi_application para obtener la aplicación ASGI de Django.
from django.core.asgi import get_asgi_application

# Obtiene el entorno de ejecución desde las variables de entorno.
environment = config('ENVIRONMENT')
# Establece la variable de entorno DJANGO_SETTINGS_MODULE según el entorno.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings."+environment)

# Inicializa la aplicación ASGI de Django.
application = get_asgi_application()
