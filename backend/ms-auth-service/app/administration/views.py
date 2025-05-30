from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import AdministrationSerializer, AdministrationCreateUpdateSerializer
from .models import Administration
from .filters import AdministrationFilter


class AdministrationViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de administraciones
    """
    serializer_class = AdministrationSerializer
    queryset = Administration.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewAdministration,
        PERMISSIONS.CreateAdministration,
        PERMISSIONS.UpdateAdministration,
        PERMISSIONS.DeleteAdministration,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = AdministrationFilter
    search_fields = ["name", "director", "mail"]
    ordering_fields = ["name", "creationDate"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdministrationCreateUpdateSerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve']:
            permission_classes = [PERMISSIONS.ViewAdministration]
        elif self.action == 'create':
            permission_classes = [PERMISSIONS.CreateAdministration]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdateAdministration]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeleteAdministration]
        return permission_classes