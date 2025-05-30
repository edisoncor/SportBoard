from rest_framework import serializers
from .models import MeasuringHealth


class MeasuringHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasuringHealth
        fields = [
            'id', 'activityFrequencie', 'bloodPressure', 'certificates', 'date',
            'height', 'heartRate', 'imc', 'oxygen', 'weight', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['imc']


class MeasuringHealthCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasuringHealth
        fields = [
            'activityFrequencie', 'bloodPressure', 'certificates', 'date',
            'height', 'heartRate', 'oxygen', 'weight'
        ]
    
    def validate(self, data):
        """
        Validaciones adicionales para los campos
        """
        # Validar altura
        if 'height' in data and data['height'] is not None:
            if data['height'] <= 0:
                raise serializers.ValidationError({"height": "La altura debe ser mayor que 0"})
                
        # Validar peso
        if 'weight' in data and data['weight'] is not None:
            if data['weight'] <= 0:
                raise serializers.ValidationError({"weight": "El peso debe ser mayor que 0"})
                
        # Validar frecuencia de actividad
        if 'activityFrequencie' in data and data['activityFrequencie'] is not None:
            if data['activityFrequencie'] < 0:
                raise serializers.ValidationError({"activityFrequencie": "La frecuencia de actividad no puede ser negativa"})
                
        # Validar nivel de oxígeno
        if 'oxygen' in data and data['oxygen'] is not None:
            if not (0 <= data['oxygen'] <= 100):
                raise serializers.ValidationError({"oxygen": "El nivel de oxígeno debe estar entre 0 y 100"})
        
        return data


class MeasuringHealthReportSerializer(serializers.ModelSerializer):
    report = serializers.SerializerMethodField()
    
    class Meta:
        model = MeasuringHealth
        fields = ['id', 'date', 'report']
    
    def get_report(self, obj):
        return obj.reports()


class MeasuringHealthGraphSerializer(serializers.ModelSerializer):
    graphs = serializers.SerializerMethodField()
    
    class Meta:
        model = MeasuringHealth
        fields = ['id', 'date', 'graphs']
    
    def get_graphs(self, obj):
        return obj.showGraphs()