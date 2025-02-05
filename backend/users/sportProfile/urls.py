
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
from django.conf import settings
from django.conf.urls.static import static

# Configuración del router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'nacionalities', NacionalityViewSet, basename='nacionality')
router.register(r'profiles', ProfileViewSet)
router.register(r'players', PlayerViewSet)

# Rutas personalizadas (si las necesitas)
urlpatterns = [
    # Ejemplo de ruta personalizada
    # path('custom-route/', custom_view, name='custom-view'),
]

# Agrega las rutas generadas por el router
urlpatterns += router.urls

# Servir archivos estáticos y multimedia en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)