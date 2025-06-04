from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PerformanceViewSet

app_name = "performance"

router = DefaultRouter()
router.register("", PerformanceViewSet)

urlpatterns = [
    path("", include(router.urls)),
]