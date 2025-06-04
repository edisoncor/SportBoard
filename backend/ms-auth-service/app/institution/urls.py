from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import InstitutionViewSet, CatalogueViewSet

app_name = "institution"

# Crear el router sin basename automático
router = DefaultRouter()
router.register("catalogues", CatalogueViewSet, basename="catalogue")
router.register("", InstitutionViewSet, basename="institution")

urlpatterns = [
    path("", include(router.urls)),
]