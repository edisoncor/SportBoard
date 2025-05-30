from rest_framework import serializers
from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'id', 'name', 'director', 'mail', 'phone', 'active', 'creationDate'
        ]


class DepartmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'name', 'director', 'mail', 'phone', 'active'
        ]

    def validate_phone(self, value):
        """
        Validar que el teléfono tenga un formato adecuado
        """
        if value and not all(c.isdigit() or c in "+-() " for c in value):
            raise serializers.ValidationError("El número de teléfono contiene caracteres no válidos")
        return value