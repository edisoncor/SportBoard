from rest_framework import serializers
from .models import User, Nacionality


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'nationality', 'birthdate', 'weigth', 'role', 'status', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user

class NacionalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nacionality
        fields = ['id', 'nacionality_name']
