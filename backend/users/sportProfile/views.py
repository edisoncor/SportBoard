from django.shortcuts import render
from .models import User, Nacionality
from .serializers import UserSerializer, NacionalitySerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status


class CreateSuperUserAPIView(APIView): 
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_staff = True
            user.is_superuser = True
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateUserAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListCreateAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk): #actualizar un usuario.
        user = self.get_object(pk)
        if user is None:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({"detail": "Usuario eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)


#=====================================================================================================================================================

class NacionalityCreateListAPIView(APIView): #listar y crear nacionalidades.
    def get(self, request):
        nacionalities = Nacionality.objects.all()
        serializer = NacionalitySerializer(nacionalities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        serializer = NacionalitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NacionalityRegisterAPIView(APIView): #obtener, actualizar y eliminar una nacionalidad específica.
    """
    API View para obtener, actualizar y eliminar una nacionalidad específica.
    """
    def get_object(self, pk):
        try:
            return Nacionality.objects.get(pk=pk)
        except Nacionality.DoesNotExist:
            return None

    def get(self, request, pk):
        nacionality = self.get_object(pk)
        if nacionality is None:
            return Response({"detail": "Nacionalidad no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        serializer = NacionalitySerializer(nacionality)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        nacionality = self.get_object(pk)
        if nacionality is None:
            return Response({"detail": "Nacionalidad no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        serializer = NacionalitySerializer(nacionality, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        nacionality = self.get_object(pk)
        if nacionality is None:
            return Response({"detail": "Nacionalidad no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        nacionality.delete()
        return Response({"detail": "Nacionalidad eliminada exitosamente."}, status=status.HTTP_204_NO_CONTENT)
