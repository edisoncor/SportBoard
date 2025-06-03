from rest_framework import serializers
from .models import SportProfile


class SportProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SportProfile
        fields = [
            'id', 'numCompetence', 'discipline', 'disciplines', 
            'user', 'user_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['disciplines']
    
    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.name} {obj.user.lastName}" if hasattr(obj.user, 'name') and hasattr(obj.user, 'lastName') else obj.user.email
        return None


class SportProfileCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SportProfile
        fields = ['numCompetence', 'discipline', 'user']
    
    def validate_numCompetence(self, value):
        """
        Validar que el número de competencias es un número no negativo
        """
        if value < 0:
            raise serializers.ValidationError("El número de competencias no puede ser negativo")
        return value


class DisciplineRegistrationSerializer(serializers.Serializer):
    discipline = serializers.CharField(max_length=100, required=True)


class SportProfileHistorySerializer(serializers.ModelSerializer):
    history = serializers.SerializerMethodField()
    
    class Meta:
        model = SportProfile
        fields = ['id', 'user', 'history']
    
    def get_history(self, obj):
        return obj.showHistory()