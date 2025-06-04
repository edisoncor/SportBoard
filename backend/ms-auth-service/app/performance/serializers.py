from rest_framework import serializers
from .models import Performance


class PerformanceSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Performance
        fields = [
            'id', 'date', 'measure', 'type', 'value', 'user', 'user_name',
            'created_at', 'updated_at'
        ]
    
    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.name} {obj.user.lastName}" if obj.user.name and obj.user.lastName else obj.user.email
        return None


class PerformanceCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = ['date', 'measure', 'type', 'value', 'user']
    
    def validate_value(self, value):
        """
        Validar que el valor es un número positivo o cero
        """
        if value < 0:
            raise serializers.ValidationError("El valor no puede ser negativo")
        return value


class PerformanceEvolutionSerializer(serializers.Serializer):
    user_dni = serializers.CharField(required=True, help_text="DNI del usuario para generar el reporte de evolución")
    
    def validate_user_dni(self, value):
        """
        Validar que existe un usuario con el DNI proporcionado
        """
        from user.models import User
        if not User.objects.filter(dni=value).exists():
            raise serializers.ValidationError("No existe un usuario con este DNI")
        return value