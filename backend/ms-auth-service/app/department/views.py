from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import DepartmentSerializer, DepartmentCreateUpdateSerializer
from .models import Department
from .filters import DepartmentFilter


class DepartmentViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de departamentos
    """
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewDepartment,
        PERMISSIONS.CreateDepartment,
        PERMISSIONS.UpdateDepartment,
        PERMISSIONS.DeleteDepartment,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = DepartmentFilter
    search_fields = ["name", "director", "mail"]
    ordering_fields = ["name", "creationDate"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DepartmentCreateUpdateSerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve']:
            permission_classes = [PERMISSIONS.ViewDepartment]
        elif self.action == 'create':
            permission_classes = [PERMISSIONS.CreateDepartment]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdateDepartment]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeleteDepartment]
        return permission_classes