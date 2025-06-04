from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import (
    MeasuringHealthSerializer, 
    MeasuringHealthCreateUpdateSerializer,
    MeasuringHealthReportSerializer,
    MeasuringHealthGraphSerializer
)
from .models import MeasuringHealth
from .filters import MeasuringHealthFilter


class MeasuringHealthViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de mediciones de salud
    """
    serializer_class = MeasuringHealthSerializer
    queryset = MeasuringHealth.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewHealth,
        PERMISSIONS.CreateHealth,
        PERMISSIONS.UpdateHealth,
        PERMISSIONS.DeleteHealth,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = MeasuringHealthFilter
    ordering_fields = ["date", "imc", "weight"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MeasuringHealthCreateUpdateSerializer
        if self.action == 'report':
            return MeasuringHealthReportSerializer
        if self.action == 'graphs':
            return MeasuringHealthGraphSerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve', 'report', 'graphs']:
            permission_classes = [PERMISSIONS.ViewHealth]
        elif self.action == 'create':
            permission_classes = [PERMISSIONS.CreateHealth]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdateHealth]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeleteHealth]
        return permission_classes
        
    @action(detail=True, methods=['get'])
    def report(self, request, pk=None):
        """
        Generar un reporte detallado de una medición específica
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    @action(detail=True, methods=['get'])
    def graphs(self, request, pk=None):
        """
        Generar datos para visualización gráfica de una medición específica
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    @action(detail=False, methods=['post'])
    def calculate_imc(self, request):
        """
        Calcular IMC a partir de peso y altura sin guardar en la base de datos
        """
        weight = request.data.get('weight')
        height = request.data.get('height')
        
        # Validar parámetros
        errors = {}
        if weight is None:
            errors['weight'] = "Este campo es requerido"
        elif float(weight) <= 0:
            errors['weight'] = "El peso debe ser mayor que 0"
            
        if height is None:
            errors['height'] = "Este campo es requerido"
        elif float(height) <= 0:
            errors['height'] = "La altura debe ser mayor que 0"
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
        # Crear una instancia temporal para usar el método
        temp_instance = MeasuringHealth()
        imc = temp_instance.imcCalculate(float(weight), float(height))
        
        # Calcular clasificación
        classification = "No disponible"
        if imc < 18.5:
            classification = "Bajo peso"
        elif 18.5 <= imc < 25:
            classification = "Normal"
        elif 25 <= imc < 30:
            classification = "Sobrepeso"
        else:
            classification = "Obesidad"
            
        return Response({
            'imc': imc,
            'classification': classification
        })