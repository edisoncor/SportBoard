from rest_framework import serializers
from .models import Administration


class AdministrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administration
        fields = [
            'id', 'name', 'director', 'mail', 'phone', 'active', 'creationDate'
        ]


class AdministrationCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administration
        fields = [
            'name', 'director', 'mail', 'phone', 'active'
        ]

    def validate_phone(self, value):
        """
        Validar que el teléfono sea un número positivo
        """
        if value is not None and value <= 0:
            raise serializers.ValidationError("El número de teléfono debe ser un valor positivo")
        return value