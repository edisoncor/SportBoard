"""
    URL patterns for the core application.

    This module defines the routing for health check endpoints and API documentation views.
"""

# Importación del módulo de administración de Django para habilitar la interfaz de administración.
from django.contrib import admin
# Importación de las funciones path e include para definir rutas y anidar URLs de otras aplicaciones.
from django.urls import path, include
# Importación de las vistas de drf_spectacular para la generación y visualización de la documentación OpenAPI.
from drf_spectacular.views import (
    SpectacularAPIView,  # Vista para la generación del esquema OpenAPI.
    SpectacularRedocView,  # Vista para la documentación interactiva con Redoc.
    SpectacularSwaggerView,  # Vista para la documentación interactiva con Swagger UI.
)
# Importación de los endpoints de salud del sistema.
from .health import health_check, simple_health_check, readiness_check, liveness_check

# Definición de los patrones de URL para la aplicación core.
urlpatterns = [
    # Endpoints de verificación de salud del sistema.
    path('health/', health_check, name='health-check'),  # Endpoint principal de health check.
    path('health/simple/', simple_health_check, name='simple-health-check'),  # Health check simple para monitoreo básico.
    path('health/ready/', readiness_check, name='readiness-check'),  # Verifica si la aplicación está lista para recibir tráfico.
    path('health/live/', liveness_check, name='liveness-check'),  # Verifica si la aplicación está viva.
    
    # Endpoints para la documentación de la API.
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  # Esquema OpenAPI en formato JSON.
    path('api/v1/doc/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),  # Documentación Swagger UI.
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),  # Documentación Redoc.
    
    # Endpoint para la interfaz de administración de Django.
    path('admin/', admin.site.urls),
    
    # Endpoints de la API agrupados por funcionalidad y versión.
    path('api/v1/auth/', include('user.urls.auth')),  # Endpoints de autenticación de usuarios.
    path('api/v1/user/', include('user.urls.user')),  # Endpoints de gestión de usuarios.
    path('api/v1/roles/', include('user.urls.roles')),  # Endpoints de gestión de roles.
    path('api/v1/permissions/', include('user.urls.permissions')),  # Endpoints de gestión de permisos.
    path('api/v1/transactions/', include('transaction.urls')),  # Endpoints de gestión de transacciones.
    path('api/v1/institutions/', include('institution.urls')),  # Endpoints de gestión de instituciones.
    path('api/v1/administrations/', include('administration.urls')),  # Endpoints de gestión de administraciones.
    path('api/v1/departments/', include('department.urls')),  # Endpoints de gestión de departamentos.
    path('api/v1/measuring-heald/', include('measuring_heald.urls')),  # Endpoints de gestión de mediciones de salud.
    path('api/v1/performance/', include('performance.urls')),  # Endpoints de gestión de rendimiento deportivo.
    path('api/v1/sport-profile/', include('sport_profile.urls')),  # Endpoints de gestión de perfiles deportivos.
    path('api/v1/catalog/', include('catalog.urls')),  # Endpoints de gestión de catálogos.
]
