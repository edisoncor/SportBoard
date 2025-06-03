from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from user.permissions import CustomPermissionMixin
from user.permission_list import PERMISSIONS
from .serializers import (
    SportProfileSerializer, 
    SportProfileCreateUpdateSerializer,
    DisciplineRegistrationSerializer,
    SportProfileHistorySerializer
)
from .models import SportProfile
from .filters import SportProfileFilter


class SportProfileViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    """
    ViewSet para la gestión de perfiles deportivos
    """
    serializer_class = SportProfileSerializer
    queryset = SportProfile.objects.all()
    custom_permissions = [
        PERMISSIONS.ViewSportProfile,
        PERMISSIONS.CreateSportProfile,
        PERMISSIONS.UpdateSportProfile,
        PERMISSIONS.DeleteSportProfile,
    ]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = SportProfileFilter
    search_fields = ["discipline"]
    ordering_fields = ["numCompetence", "discipline"]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SportProfileCreateUpdateSerializer
        if self.action == 'register_discipline':
            return DisciplineRegistrationSerializer
        if self.action == 'history':
            return SportProfileHistorySerializer
        return super().get_serializer_class()

    def get_custom_permissions(self):
        permission_classes = []
        if self.action in ['list', 'retrieve', 'history']:
            permission_classes = [PERMISSIONS.ViewSportProfile]
        elif self.action in ['create', 'register_discipline']:
            permission_classes = [PERMISSIONS.CreateSportProfile]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [PERMISSIONS.UpdateSportProfile]
        elif self.action == 'destroy':
            permission_classes = [PERMISSIONS.DeleteSportProfile]
        return permission_classes
        
    @action(detail=True, methods=['post'])
    def register_discipline(self, request, pk=None):
        """
        Registra una nueva disciplina para un perfil deportivo específico
        """
        profile = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        discipline = serializer.validated_data['discipline']
        success = profile.registerDiscipline(discipline)
        
        if success:
            return Response(
                {"message": "Disciplina registrada exitosamente", "success": True},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "No se pudo registrar la disciplina. Posiblemente ya existe.", "success": False},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Obtiene el historial deportivo de un usuario
        """
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_competition(self, request, pk=None):
        """
        Añade una competencia al historial del usuario y actualiza el contador
        """
        profile = self.get_object()
        
        # Validar datos de entrada
        try:
            competition_data = request.data
            required_fields = ['name', 'date', 'location']
            
            for field in required_fields:
                if field not in competition_data:
                    return Response(
                        {"error": f"El campo '{field}' es obligatorio"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Inicializar el historial si es necesario
            if not profile.history:
                profile.history = {"competitions": []}
            elif "competitions" not in profile.history:
                profile.history["competitions"] = []
            
            # Añadir la competencia
            profile.history["competitions"].append(competition_data)
            
            # Incrementar el contador de competencias
            profile.numCompetence += 1
            
            # Guardar los cambios
            profile.save()
            
            return Response(
                {"message": "Competencia añadida exitosamente", "success": True},
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {"error": f"Error al añadir competencia: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )