from rest_framework import serializers
from .models import User, Nacionality, Profile, Player

from rest_framework import serializers
from .models import User, Nacionality, Profile, Player
from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('Usuario inactivo.')
                data['user'] = user
            else:
                raise serializers.ValidationError('Credenciales incorrectas.')
        else:
            raise serializers.ValidationError('Debe proporcionar un nombre de usuario y una contraseña.')

        return data
class NacionalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nacionality
        fields = ['id', 'nacionality_name']

class UserSerializer(serializers.ModelSerializer):
    nationality = NacionalitySerializer(read_only=True)  # Serializador anidado para la respuesta
    nationality_id = serializers.PrimaryKeyRelatedField(
        queryset=Nacionality.objects.all(),  # Define el queryset para la relación
        source='nationality',  # Asocia este campo con el campo `nationality` del modelo
        write_only=True,  # Solo se usa para escritura, no se incluye en la respuesta
        allow_null=True,  # Permite que el campo sea nulo
        required=False  # No es obligatorio
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'nationality', 'nationality_id', 'birthdate', 'weigth',
            'role', 'status', 'email', 'password', 'first_name', 'last_name'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # Oculta la contraseña en las respuestas
            'first_name': {'required': False, 'allow_null': True},
            'last_name': {'required': False, 'allow_null': True},
            'nationality': {'required': False, 'allow_null': True},
            'birthdate': {'required': False, 'allow_null': True},
            'weigth': {'required': False, 'allow_null': True},
            'role': {'default': 'USER'},         
            'status': {'default': 'ACTIVE'} 
        }

    def create(self, validated_data):
        # Extrae la nacionalidad si está presente
        nationality = validated_data.pop('nationality', None)
        
        # Crea el usuario
        user = User.objects.create_user(**validated_data)
        
        # Asigna la nacionalidad si se proporcionó
        if nationality:
            user.nationality = nationality
            user.save()
        Profile.objects.create(user=user, bio='', avatar='')
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'avatar']

class PlayerSerializer(UserSerializer):  # Extiende UserSerializer
    class Meta:
        model = Player
        fields = UserSerializer.Meta.fields + ['team', 'jersey_number', 'position', 'player_status']