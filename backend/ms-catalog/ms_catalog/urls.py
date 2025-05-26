"""
URL configuration for ms_catalog project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Catalog API",
        default_version='v1',
        description="""
API RESTful para la gestión de catálogos jerárquicos, categorías e ítems. Permite operaciones de consulta, creación, actualización, eliminación y acciones personalizadas sobre los recursos del catálogo, siguiendo buenas prácticas de versionado, paginación, HATEOAS y manejo de errores. Documentación interactiva y endpoints estandarizados para facilitar la integración y el descubrimiento de la API.
""",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/catalog/', include('catalog.urls')),
    path('api/v1/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
