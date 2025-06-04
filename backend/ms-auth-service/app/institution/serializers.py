from rest_framework import serializers
from .models import Institution, Catalogue


class CatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['id', 'name', 'description', 'type', 'code']


class InstitutionSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = Institution
        fields = [
            'id', 'name', 'director', 'direction', 'mail', 'phone', 'active',
            'city', 'city_name', 'location', 'location_name', 'creationDate'
        ]


class InstitutionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            'name', 'director', 'direction', 'mail', 'phone', 'active',
            'city', 'location'
        ]

    def validate_phone(self, value):
        """
        Validar que el teléfono sea un número positivo
        """
        if value is not None and value <= 0:
            raise serializers.ValidationError("El número de teléfono debe ser un valor positivo")
        return value