from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AdministrationViewSet

app_name = "administration"

router = DefaultRouter()
router.register("", AdministrationViewSet)

urlpatterns = [
    path("", include(router.urls)),
]