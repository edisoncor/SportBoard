from datetime import datetime, timezone

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import filters, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .enums import TokenEnum
from .filters import UserFilter
from .models import Permission, Role, Token, User
from .serializers import (CreatePasswordFromTokenSerializer,
                          CreateUserSerializer,
                          CustomObtainTokenPairSerializer, EmailSerializer,
                          ListUserSerializer, PasswordChangeSerializer,
                          PermissionListSerializer, RoleResponseDocSerializer,
                          RoleSerializer, TokenDecodeSerializer,
                          UpdateUserSerializer)
from .tasks import send_password_reset_email
from .utils import IsAdmin, create_token_and_send_user_email, is_admin_user


class CustomObtainTokenPairView(TokenObtainPairView):
    """
    Vista para obtener pares de tokens JWT usando autenticación por email y contraseña.
    Extiende TokenObtainPairView para usar un serializador personalizado que maneja autenticación por email.
    """
    serializer_class = CustomObtainTokenPairSerializer


class AuthViewsets(viewsets.GenericViewSet):
    """
    Viewset para operaciones relacionadas con autenticación como reseteo de contraseña y verificación de cuenta.
    Provee endpoints para gestión de contraseñas y verificación de cuenta sin requerir autenticación completa para ciertas acciones.
    """
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    
    def get_permissions(self):
        """
        Determina los permisos requeridos para diferentes acciones.
        Sobrescribe las clases de permisos por defecto para acciones específicas como reseteo de contraseña y verificación de cuenta.
        
        Returns:
            list: Lista de instancias de clases de permisos.
        """
        permission_classes = self.permission_classes
        if self.action in ["initiate_password_reset", "create_password", "verify_account"]:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    
    @action(
        methods=["POST"],
        detail=False,
        serializer_class=EmailSerializer,
        url_path="initiate-password-reset",
    )
    def initiate_password_reset(self, request, pk=None):
        """
        Envía un token temporal al email del usuario para reseteo de contraseña.
        
        Esta endpoint acepta una dirección de email, la valida, y si encuentra un
        usuario activo que coincida, envía un token de reseteo de contraseña a ese email.
        
        Args:
            request: Objeto HTTP request con los datos del usuario.
            pk: No usado en esta acción.
            
        Returns:
            Response: Respuesta indicando éxito o fallo de la operación.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data["email"].lower().strip()
        user = get_user_model().objects.filter(email=email, is_active=True).first()
        if not user:
            return Response({"success": False, "message": "No active account found!"}, status=400)

        token, _ = Token.objects.update_or_create(
            user=user,
            token_type=TokenEnum.PASSWORD_RESET,
            defaults={
                "user": user,
                "token_type": TokenEnum.PASSWORD_RESET,
                "token": get_random_string(20),
                "created_at": datetime.now(timezone.utc)
            }
        )

        email_data = {
            "fullname": user.firstname,
            "email": user.email,
            "token": f"{token.token}",
        }
        send_password_reset_email.delay(email_data)

        return Response({"success": True,
                         "message": "Temporary password sent to your email!"}, status=200)
    
    @action(methods=['POST'], detail=False, serializer_class=CreatePasswordFromTokenSerializer, url_path='create-password')
    def create_password(self, request, pk=None):
        """
        Crea una nueva contraseña usando el token enviado al email del usuario.
        
        Esta endpoint valida el token y si es válido, restablece la contraseña del usuario
        a la nueva contraseña proporcionada en la solicitud.
        
        Args:
            request: Objeto HTTP request con el token y la nueva contraseña.
            pk: No usado en esta acción.
            
        Returns:
            Response: Respuesta indicando éxito o fallo del reseteo de contraseña.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token: Token = Token.objects.filter(
            token=request.data['token'],  token_type=TokenEnum.PASSWORD_RESET).first()
        if not token or not token.is_valid():
            return Response({'success': False, 'errors': 'Invalid token specified'}, status=400)
        token.reset_user_password(request.data['new_password'])
        token.delete()
        return Response({'success': True, 'message': 'Password successfully reset'}, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: inline_serializer(
                name='AccountVerificationStatus',
                fields={
                    "success": serializers.BooleanField(default=True),
                    "message": serializers.CharField(default="Acount Verification Successful")
                }
            ),
        },
    )

    @action(
        methods=["POST"],
        detail=False,
        serializer_class=TokenDecodeSerializer,
        url_path="verify-account",
    )
    def verify_account(self, request, pk=None):
        """
        Activa una cuenta de usuario usando el token de verificación enviado al usuario.
        
        Esta endpoint valida el token de verificación de cuenta y si es válido,
        marca al usuario como verificado y activo.
        
        Args:
            request: Objeto HTTP request con el token.
            pk: No usado en esta acción.
            
        Returns:
            Response: Respuesta indicando éxito o fallo de la verificación de cuenta.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token: Token = Token.objects.filter(
            token=request.data['token'],  token_type=TokenEnum.ACCOUNT_VERIFICATION).first()
        if not token or not token.is_valid():
            return Response({'success': False, 'errors': 'Invalid token specified'}, status=400)
        token.verify_user()
        token.delete()
        return Response({"success": True, "message": "Acount Verification Successful"}, status=200)


class PasswordChangeView(viewsets.GenericViewSet):
    '''
    Viewset que permite a usuarios autenticados cambiar su contraseña.
    
    Provee un endpoint para actualizar la contraseña estando autenticado.
    '''
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Maneja solicitudes de cambio de contraseña de usuarios autenticados.
        
        Valida la contraseña antigua y la nueva, y si es válido,
        actualiza la contraseña del usuario.
        
        Args:
            request: Objeto HTTP request con las contraseñas.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.
            
        Returns:
            Response: Respuesta indicando éxito del cambio de contraseña.
        """
        context = {"request": request}
        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Your password has been updated."}, status.HTTP_200_OK)


class UserViewsets(viewsets.ModelViewSet):
    """
    Viewset para gestión de usuarios en el sistema.
    
    Provee operaciones CRUD, filtrado, búsqueda y ordenamiento. Usa diferentes serializadores según la operación y aplica permisos según el rol del usuario.
    """
    queryset = get_user_model().objects.all().prefetch_related(
        'role')
    serializer_class = ListUserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete"]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = UserFilter
    search_fields = ["email", "firstname", "lastname", "phone"]
    ordering_fields = [
        "created_at",
        "email",
        "firstname",
        "lastname",
        "phone",
    ]
    def get_queryset(self):
        """
        Obtiene el queryset según el rol del usuario autenticado.
        
        Los administradores ven todos los usuarios, los usuarios normales solo a sí mismos.
        
        Returns:
            QuerySet: Queryset filtrado de objetos User.
        """
        user: User = self.request.user
        if is_admin_user(user):
            return super().get_queryset().all()
        return super().get_queryset().filter(id=user.id)
    def get_serializer_class(self):
        """
        Retorna el serializador apropiado según la acción actual.
        
        Diferentes serializadores son usados para crear, actualizar y listar usuarios.
        
        Returns:
            Clase de serializador apropiada para la acción.
        """
        if self.action in ["create"]:
            return CreateUserSerializer
        if self.action in ["partial_update", "update"]:
            return UpdateUserSerializer
        return super().get_serializer_class()
        
    def get_permissions(self):
        """
        Determina los permisos requeridos para diferentes acciones.
        
        Diferentes acciones requieren diferentes niveles de permiso:
        - Crear y eliminar usuarios requiere privilegios de administrador
        - Listar, recuperar y actualizar pueden requerir solo autenticación
        
        Returns:
            list: Lista de instancias de clases de permisos.
        """
        permission_classes = self.permission_classes
        if self.action in ["create"]:
            permission_classes = [IsAdmin]
        elif self.action in ["reinvite_user"]:
            permission_classes = [AllowAny]
        elif self.action in ["list", "retrieve", "partial_update", "update"]:
            permission_classes = [IsAuthenticated]
        elif self.action in ["destroy"]:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]
    
    def list(self, request, *args, **kwargs):
        """
        Recupera una lista de usuarios según el rol del usuario autenticado.
        
        Los administradores ven todos los usuarios, los usuarios normales solo a sí mismos.
        
        Args:
            request: Objeto HTTP request.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.
            
        Returns:
            Response: Respuesta con la lista de usuarios.
        """
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Crea un nuevo usuario en el sistema.
        
        Solo administradores pueden crear usuarios directamente en el sistema.
        
        Args:
            request: Objeto HTTP request con los datos del usuario.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.
            
        Returns:
            Response: Respuesta con los datos del usuario creado.
        """
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Realiza operaciones adicionales durante la creación de usuario.
        
        Este método asigna el campo created_by al usuario actual.
        
        Args:
            serializer: Instancia del serializador con los datos validados.
        """
        serializer.save(created_by=self.request.user)    
        
    def _reinvite_check(self, request):
        """
        Método auxiliar para verificar si un usuario puede ser reenviado invitación.
        
        Verifica si existe y no está verificado.
        
        Args:
            request: Objeto HTTP request con el email.
            
        Returns:
            User: Usuario a reenviar si existe y no está verificado, None si ya está verificado.
        """
        email: str = request.data["email"].lower().strip()
        user: User = get_object_or_404(User, email=email)
        if user.verified:
            return None
        else:
            return user
    @action(
        methods=["POST"],
        detail=False,
        serializer_class=EmailSerializer,
        url_path="resend-verification",
    )
    def reinvite_user(self, request, *args, **kwargs):
        '''
        Reenvía email de verificación a un usuario que no ha verificado su cuenta.
        
        Esta endpoint acepta una dirección de email y envía un nuevo token de verificación
        a ese email si el usuario existe y aún no está verificado.
        
        Args:
            request: Objeto HTTP request con el email.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.
            
        Returns:
            Response: Respuesta indicando éxito o fallo de la operación.
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self._reinvite_check(request)
        if not user:
            return Response({"success": False, "message": "User already verified"}, status.HTTP_400_BAD_REQUEST)
        create_token_and_send_user_email(
            user=user, token_type=TokenEnum.ACCOUNT_VERIFICATION)
        return Response({"success": True, "message": "Verification mail sent successfully."}, status.HTTP_200_OK)



class RoleViewSet(viewsets.ModelViewSet):
    """
    Viewset para gestión de roles en el sistema.
    
    Provee operaciones CRUD, filtrado, búsqueda y ordenamiento. Solo administradores pueden acceder a estos endpoints.
    """
    permission_classes = [IsAdmin]
    queryset = Role.objects.all().prefetch_related("permissions")
    http_method_names = ["get", "post", "delete", "patch"]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    ordering_fields = ["updated_at"]
    search_fields = ["name",]
    serializer_class = RoleSerializer
    
    @extend_schema(responses={200:RoleResponseDocSerializer(many=True)})
    def list(self, request, *args, **kwargs):
        """
        Lista todos los roles.
        
        Args:
            request: Objeto HTTP request.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.
            
        Returns:
            Response: Respuesta con la lista de roles.
        """
        return super().list(request, *args, **kwargs)

    @extend_schema(responses={200:RoleResponseDocSerializer()})
    def retrieve(self, request, *args, **kwargs):
        """
        Recupera un rol específico.
        
        Args:
            request: Objeto HTTP request.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables, incluyendo 'pk' para el ID del rol.
            
        Returns:
            Response: Respuesta con los detalles del rol.
        """
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(responses={200:RoleResponseDocSerializer()})
    def partial_update(self, request, *args, **kwargs):
        """
        Actualiza parcialmente un rol.
        
        Args:
            request: Objeto HTTP request con los campos a actualizar.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables, incluyendo 'pk' para el ID del rol.
            
        Returns:
            Response: Respuesta con los detalles del rol actualizado.
        """
        return super().partial_update(request, *args, **kwargs)

    def get_queryset(self):
        """
        Obtiene el queryset para la vista.
        
        Returns:
            QuerySet: Queryset de objetos Role.
        """
        queryset = super().get_queryset()
        return queryset
        
    @extend_schema(responses={200: PermissionListSerializer(many=True)})
    @action(methods=['GET'], detail=True, url_path='permissions', serializer_class=PermissionListSerializer, pagination_class=None)
    def get_permissions_by_role(self, request, pk=None):
        """ 
        Retorna todos los permisos asignados a un rol específico.
        
        Esta endpoint recupera todos los permisos asociados con el rol especificado.
        
        Args:
            request: Objeto HTTP request.
            pk: Clave primaria del rol.
            
        Returns:
            Response: Respuesta con la lista de permisos del rol.
        """
        role = self.get_object()
        permissions = role.permissions.all()
        serializer = self.serializer_class(permissions, many=True)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


class PermissionViewSet(viewsets.ModelViewSet):
    """
    Viewset para gestión de permisos. Solo administradores pueden acceder. Permite listar permisos pre-cargados en la base de datos.
    """
    permission_classes = [IsAdmin]
    queryset = Permission.objects.all()
    pagination_class = None
    http_method_names = ["get"]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    ordering_fields = ["updated_at"]
    serializer_class = PermissionListSerializer

    def list(self, request, *args, **kwargs):
        """
        Recupera los permisos pre-cargados en la base de datos del sistema.

        Args:
            request: Objeto HTTP request.
            *args: Argumentos variables.
            **kwargs: Argumentos clave variables.

        Returns:
            Response: Respuesta con la lista de permisos.
        """
        return super().list(request, *args, **kwargs)



from functools import wraps
from rest_framework.exceptions import AuthenticationFailed


class TokenDecode(APIView):

    """
    Vista API para decodificar tokens JWT y obtener información de usuario.
    Valida el token JWT proporcionado, lo decodifica y obtiene el usuario asociado, retornando también sus permisos.
    Atributos:
        serializer_class: Clase de serializador usada para validar los datos de entrada.
        permission_classes: Permisos requeridos para acceder a esta vista.
    """
    serializer_class = TokenDecodeSerializer
    permission_classes = [IsAuthenticated]
    

    def post(self, request):
        """
        Decodifica un token JWT y obtiene información del usuario.
        Args:
            request: Objeto HTTP request con el token JWT.
        Returns:
            Response: Respuesta con la información del usuario y sus permisos.
        Raises:
            AuthenticationFailed: Si el token es inválido o el usuario no puede ser autenticado.
        """
        token = request.data.get('token', None)
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms="HS256")
            except Exception as err:
                raise AuthenticationFailed(F'Unauthenticated: {err}')

            user = User.objects.get(id=payload['user_id'])
            serializer = ListUserSerializer(instance=user)
            return Response(
                {**serializer.data, "permissions": user.permission_list()})

        raise AuthenticationFailed('Unauthenticated')
