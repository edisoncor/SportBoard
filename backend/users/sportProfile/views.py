from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import *
from .serializers import *

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Aquí puedes generar un token o devolver información del usuario
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # Agrega más campos si es necesario
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Vista para operaciones CRUD de Nacionality
class NacionalityViewSet(viewsets.ModelViewSet):
    queryset = Nacionality.objects.all()
    serializer_class = NacionalitySerializer

# Vista para operaciones CRUD de Profile
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

# Vista para operaciones CRUD de Player
class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer