from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Nacionality
from .serializers import UserSerializer, NacionalitySerializer

# Vista para operaciones CRUD estándar de User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Acción personalizada para crear un superusuario
    @action(detail=False, methods=['post'])
    def create_superuser(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_staff = True
            user.is_superuser = True
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NacionalityViewSet(viewsets.ModelViewSet):
    queryset = Nacionality.objects.all()
    serializer_class = NacionalitySerializer