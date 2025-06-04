from django.db import models
from core.models import AuditableModel
import json
from user.models import User


class MeasuringHealth(AuditableModel):
    """
    Modelo para gestionar métricas de salud y mediciones físicas
    """
    activityFrequencie = models.FloatField(help_text="Frecuencia de actividad física (horas por semana)", blank=True, null=True)
    bloodPressure = models.FloatField(help_text="Presión arterial", blank=True, null=True)
    certificates = models.JSONField(help_text="Certificados médicos o de salud", blank=True, null=True)
    date = models.DateField(help_text="Fecha de la medición")
    height = models.FloatField(help_text="Altura en metros", blank=True, null=True)
    heartRate = models.IntegerField(help_text="Ritmo cardíaco (pulsaciones por minuto)", blank=True, null=True)
    imc = models.FloatField(help_text="Índice de masa corporal", blank=True, null=True)
    oxygen = models.FloatField(help_text="Nivel de oxígeno en sangre (%)", blank=True, null=True)
    weight = models.FloatField(help_text="Peso en kilogramos", blank=True, null=True)

    # Add relationship to User
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_measurements')

    def imcCalculate(self, weight=None, height=None):
        """
        Calcula el IMC (Índice de Masa Corporal) usando la fórmula: peso (kg) / altura² (m)
        Si no se proporcionan los parámetros, usa los valores almacenados en el modelo.
        """
        weight_to_use = weight if weight is not None else self.weight
        height_to_use = height if height is not None else self.height
        
        if not weight_to_use or not height_to_use:
            return None
            
        if height_to_use <= 0 or weight_to_use <= 0:
            return None
            
        return weight_to_use / (height_to_use ** 2)
    
    def reports(self):
        """
        Genera un informe detallado de las métricas de salud
        """
        # Calcular estado del IMC
        imc_state = "No disponible"
        if self.imc:
            if self.imc < 18.5:
                imc_state = "Bajo peso"
            elif 18.5 <= self.imc < 25:
                imc_state = "Normal"
            elif 25 <= self.imc < 30:
                imc_state = "Sobrepeso"
            else:
                imc_state = "Obesidad"
                
        # Calcular estado de la presión arterial
        bp_state = "No disponible"
        if self.bloodPressure:
            if self.bloodPressure < 90:
                bp_state = "Baja"
            elif 90 <= self.bloodPressure < 120:
                bp_state = "Normal"
            elif 120 <= self.bloodPressure < 130:
                bp_state = "Elevada"
            elif 130 <= self.bloodPressure < 140:
                bp_state = "Hipertensión Fase 1"
            else:
                bp_state = "Hipertensión Fase 2"
                
        # Crear y retornar el reporte
        report = {
            "date": self.date.isoformat() if self.date else None,
            "metrics": {
                "imc": self.imc,
                "imc_classification": imc_state,
                "weight": self.weight,
                "height": self.height,
                "blood_pressure": self.bloodPressure,
                "blood_pressure_classification": bp_state,
                "heart_rate": self.heartRate,
                "oxygen_level": self.oxygen,
                "activity_frequency": self.activityFrequencie
            },
            "has_certificates": bool(self.certificates),
            "summary": f"Medición del {self.date.strftime('%d/%m/%Y') if self.date else 'fecha no disponible'}"
        }
        
        return report
    
    def showGraphs(self):
        """
        Genera datos para visualización gráfica de las métricas de salud
        """
        # Este método retornaría datos formateados para ser usados en gráficos
        # en el frontend (por ejemplo, series temporales, comparativas, etc.)
        graph_data = {
            "time_series": {
                "labels": [self.date.isoformat() if self.date else "N/A"],
                "datasets": {
                    "weight": [self.weight] if self.weight is not None else [],
                    "imc": [self.imc] if self.imc is not None else [],
                    "blood_pressure": [self.bloodPressure] if self.bloodPressure is not None else [],
                    "heart_rate": [self.heartRate] if self.heartRate is not None else [],
                    "oxygen_level": [self.oxygen] if self.oxygen is not None else []
                }
            },
            "comparison": {
                "imc": {
                    "value": self.imc,
                    "min_healthy": 18.5,
                    "max_healthy": 24.9
                },
                "blood_pressure": {
                    "value": self.bloodPressure,
                    "min_healthy": 90,
                    "max_healthy": 120
                },
                "heart_rate": {
                    "value": self.heartRate,
                    "min_healthy": 60,
                    "max_healthy": 100
                },
                "oxygen_level": {
                    "value": self.oxygen,
                    "min_healthy": 95,
                    "max_healthy": 100
                }
            }
        }
        
        return graph_data

    def __str__(self):
        return f"Medición de salud del {self.date}"
    
    def save(self, *args, **kwargs):
        # Auto-calcular IMC si no está establecido pero hay peso y altura
        if self.imc is None and self.weight is not None and self.height is not None:
            self.imc = self.imcCalculate()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ["-date"]
        verbose_name = "Medición de Salud"
        verbose_name_plural = "Mediciones de Salud"