from django.db import models
from core.models import AuditableModel
from user.models import User
from sport_profile.models import SportProfile
from measuring_heald.models import MeasuringHealth
from datetime import datetime, timedelta


class Performance(AuditableModel):
    """
    Modelo para gestionar mediciones de rendimiento deportivo
    """
    date = models.DateField(help_text="Fecha de la medición de rendimiento")
    measure = models.CharField(max_length=100, help_text="Indicador medido (p.ej. velocidad, resistencia)")
    type = models.CharField(max_length=50, help_text="Tipo de medición (p.ej. carrera, salto, fuerza)")
    value = models.FloatField(help_text="Valor numérico del rendimiento")
    user = models.ForeignKey(
        'user.User', 
        on_delete=models.CASCADE, 
        related_name='performances',
        help_text="Usuario al que pertenece esta medición de rendimiento"
    )

    sport_profile = models.ForeignKey(SportProfile, on_delete=models.CASCADE, related_name='performances')

    # Add Many-to-Many relationship with MeasuringHealth
    health_measurements = models.ManyToManyField(MeasuringHealth, related_name='performances')

    def generateEvolutionPerformance(self, id):
        """
        Genera datos de evolución del rendimiento para un usuario específico
        
        Args:
            id: DNI del usuario para filtrar sus mediciones

        Returns:
            Dict con datos de evolución de rendimiento organizados por tipo de medición
        """
        try:
            # Buscar usuario por DNI
            user = User.objects.filter(dni=id).first()
            if not user:
                return {"error": "Usuario no encontrado", "success": False}
            
            # Obtener todas las mediciones de rendimiento del usuario
            user_performances = Performance.objects.filter(
                user=user
            ).order_by('date', 'type', 'measure')
            
            if not user_performances:
                return {
                    "user": id,
                    "message": "No hay mediciones registradas para este usuario",
                    "data": {},
                    "success": True
                }
            
            # Agrupar mediciones por tipo y medida
            evolution_data = {}
            
            for performance in user_performances:
                type_key = performance.type
                measure_key = performance.measure
                
                if type_key not in evolution_data:
                    evolution_data[type_key] = {}
                
                if measure_key not in evolution_data[type_key]:
                    evolution_data[type_key][measure_key] = {
                        "dates": [],
                        "values": [],
                        "improvement": None,
                        "average": None
                    }
                
                evolution_data[type_key][measure_key]["dates"].append(
                    performance.date.strftime('%Y-%m-%d')
                )
                evolution_data[type_key][measure_key]["values"].append(performance.value)
            
            # Calcular estadísticas para cada medición
            for type_key in evolution_data:
                for measure_key in evolution_data[type_key]:
                    values = evolution_data[type_key][measure_key]["values"]
                    
                    # Calcular promedio
                    if values:
                        evolution_data[type_key][measure_key]["average"] = sum(values) / len(values)
                    
                    # Calcular mejora (diferencia entre el último y primer valor)
                    if len(values) >= 2:
                        first_value = values[0]
                        last_value = values[-1]
                        improvement = last_value - first_value
                        improvement_percent = (improvement / first_value) * 100 if first_value != 0 else 0
                        
                        evolution_data[type_key][measure_key]["improvement"] = {
                            "absolute": improvement,
                            "percent": improvement_percent
                        }
            
            return {
                "user": id,
                "data": evolution_data,
                "success": True
            }
            
        except Exception as e:
            return {"error": str(e), "success": False}
    
    @classmethod
    def registerIndicators(cls, measure, type, value, date):
        """
        Registra nuevos indicadores de rendimiento para el usuario actual
        
        Args:
            measure: Indicador medido
            type: Tipo de medición
            value: Valor numérico del rendimiento
            date: Fecha de la medición
            
        Returns:
            void
        """
        try:
            # Esta implementación es un ejemplo y deberá adaptarse al contexto real
            # donde se obtenga el usuario actual de alguna manera, por ejemplo:
            # - Desde el request en una vista
            # - Pasando el usuario como parámetro adicional
            
            # En un caso real, se podría implementar así en una vista:
            # Performance.objects.create(
            #     measure=measure,
            #     type=type,
            #     value=value,
            #     date=date,
            #     user=request.user
            # )
            
            # Para fines de la implementación del modelo, esta función no hace nada
            # ya que requiere el contexto de una solicitud HTTP
            pass
        except Exception as e:
            # Log del error
            print(f"Error registrando indicadores: {str(e)}")

    def __str__(self):
        return f"{self.measure} ({self.type}) - {self.date}"
    
    class Meta:
        ordering = ["-date", "type", "measure"]
        verbose_name = "Rendimiento"
        verbose_name_plural = "Rendimientos"
        # Índices para mejorar rendimiento en consultas frecuentes
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['type', 'measure']),
        ]