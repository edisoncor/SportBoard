from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SportProfileViewSet

app_name = "sport_profile"

router = DefaultRouter()
router.register("", SportProfileViewSet)

urlpatterns = [
    path("", include(router.urls)),
]