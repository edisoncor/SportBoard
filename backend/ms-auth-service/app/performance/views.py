from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import (
    PerformanceSerializer, 
    PerformanceCreateUpdateSerializer,
    PerformanceEvolutionSerializer
)
from .models import Performance
from .filters import PerformanceFilter


class PerformanceViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de mediciones de rendimiento
    """
    serializer_class = PerformanceSerializer
    queryset = Performance.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewPerformance,
        PERMISSIONS.CreatePerformance,
        PERMISSIONS.UpdatePerformance,
        PERMISSIONS.DeletePerformance,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = PerformanceFilter
    search_fields = ["measure", "type"]
    ordering_fields = ["date", "value", "measure", "type"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PerformanceCreateUpdateSerializer
        if self.action == 'evolution':
            return PerformanceEvolutionSerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve', 'evolution']:
            permission_classes = [PERMISSIONS.ViewPerformance]
        elif self.action == 'create':
            permission_classes = [PERMISSIONS.CreatePerformance]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdatePerformance]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeletePerformance]
        return permission_classes

    def perform_create(self, serializer):
        serializer.save()
        
    @action(detail=False, methods=['post'])
    def evolution(self, request):
        """
        Genera un reporte de evolución de rendimiento para un usuario específico
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_dni = serializer.validated_data['user_dni']
        
        # Crear una instancia temporal para usar el método
        temp_instance = Performance()
        evolution_data = temp_instance.generateEvolutionPerformance(user_dni)
        
        return Response(evolution_data)
        
    @action(detail=False, methods=['post'])
    def register_indicator(self, request):
        """
        Registra un nuevo indicador de rendimiento
        """
        serializer = PerformanceCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        measure = serializer.validated_data['measure']
        type_value = serializer.validated_data['type']
        value = serializer.validated_data['value']
        date = serializer.validated_data['date']
        user = serializer.validated_data['user']
        
        # Crear el registro directamente
        performance = Performance.objects.create(
            measure=measure,
            type=type_value,
            value=value,
            date=date,
            user=user
        )
        
        return Response(
            PerformanceSerializer(performance).data,
            status=status.HTTP_201_CREATED
        )