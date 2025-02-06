
from django.urls import path

from .views import NacionalityRegisterAPIView, CreateSuperUserAPIView, NacionalityCreateListAPIView, UserListCreateAPIView, UserDetailAPIView, CreateUserAPIView

urlpatterns = [

    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'), #obtener y crear usuarios.
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'), #obtener, actualizar y eliminar un usuario específico.
    path('users/create/', CreateUserAPIView.as_view(), name='create-user'), #crear un usuario.

    path('create-superuser/', CreateSuperUserAPIView.as_view(), name='create-superuser'), #crear un superusuario.

    path('nacionalities/', NacionalityCreateListAPIView.as_view(), name='nacionality-list-create'),
    path('nacionalities/<int:pk>/', NacionalityRegisterAPIView.as_view(), name='nacionality-register'),

]
