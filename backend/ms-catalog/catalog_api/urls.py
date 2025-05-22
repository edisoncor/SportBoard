"""
URL routing para la API de catálogo, usando DefaultRouter y versionado.
"""
from rest_framework.routers import DefaultRouter
from .views import CatalogCategoryViewSet, CatalogItemViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'categories', CatalogCategoryViewSet, basename='catalogcategory')
router.register(r'items', CatalogItemViewSet, basename='catalogitem')

urlpatterns = [
    path('', include(router.urls)),
]
