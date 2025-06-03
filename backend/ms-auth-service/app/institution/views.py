from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import InstitutionSerializer, InstitutionCreateUpdateSerializer, CatalogueSerializer
from .models import Institution, Catalogue
from .filters import InstitutionFilter, CatalogueFilter


class CatalogueViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de catálogos (ciudades y ubicaciones)
    """
    serializer_class = CatalogueSerializer
    queryset = Catalogue.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = CatalogueFilter
    search_fields = ["name", "description", "type", "code"]
    ordering_fields = ["name", "type"]


class InstitutionViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de instituciones
    """
    serializer_class = InstitutionSerializer
    queryset = Institution.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewInstitution,
        PERMISSIONS.CreateInstitution,
        PERMISSIONS.UpdateInstitution,
        PERMISSIONS.DeleteInstitution,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = InstitutionFilter
    search_fields = ["name", "director", "mail", "city__name", "location__name"]
    ordering_fields = ["name", "creationDate", "city__name"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return InstitutionCreateUpdateSerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve']:
            permission_classes = [PERMISSIONS.ViewInstitution]
        elif self.action == 'create':
            permission_classes = [PERMISSIONS.CreateInstitution]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdateInstitution]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeleteInstitution]
        return permission_classes