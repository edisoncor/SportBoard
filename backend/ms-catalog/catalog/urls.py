from rest_framework.routers import DefaultRouter
from catalog.views import CatalogCategoryViewSet, CatalogItemViewSet

router = DefaultRouter()
router.register(r'categories', CatalogCategoryViewSet, basename='catalogcategory')
router.register(r'items', CatalogItemViewSet, basename='catalogitem')

urlpatterns = router.urls
