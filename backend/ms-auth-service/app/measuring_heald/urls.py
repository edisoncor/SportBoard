from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import MeasuringHealthViewSet

app_name = "measuring_heald"

router = DefaultRouter()
router.register("", MeasuringHealthViewSet)

urlpatterns = [
    path("", include(router.urls)),
]