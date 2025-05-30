from django.db import models
from core.models import AuditableModel
from user.models import User
from datetime import datetime


class SportProfile(AuditableModel):
    """
    Modelo para gestionar perfiles deportivos de los usuarios
    """
    numCompetence = models.IntegerField(
        default=0, 
        help_text="Número de competencias en las que ha participado"
    )
    discipline = models.CharField(
        max_length=100, 
        help_text="Disciplina deportiva principal"
    )
    user = models.OneToOneField(
        'user.User',
        on_delete=models.CASCADE,
        related_name='sport_profile',
        help_text="Usuario al que pertenece este perfil deportivo"
    )
    
    # Se podrían añadir más campos como nivel, años de experiencia, etc.
    disciplines = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de disciplinas que practica el usuario"
    )
    
    history = models.JSONField(
        default=dict,
        blank=True,
        help_text="Historial deportivo del usuario"
    )

    def registerDiscipline(self, discipline):
        """
        Registra una nueva disciplina deportiva para el usuario
        
        Args:
            discipline: Nombre de la disciplina a registrar
            
        Returns:
            bool: True si se registró correctamente, False en caso contrario
        """
        try:
            if not discipline or not isinstance(discipline, str):
                return False
                
            # Si el campo disciplines es None, inicializarlo como lista vacía
            if self.disciplines is None:
                self.disciplines = []
                
            # Convertir a minúsculas para evitar duplicados por mayúsculas/minúsculas
            discipline_lower = discipline.lower().strip()
            
            # Verificar si la disciplina ya existe
            disciplines_lower = [d.lower() for d in self.disciplines]
            if discipline_lower in disciplines_lower:
                return False  # La disciplina ya existe
                
            # Agregar la nueva disciplina
            self.disciplines.append(discipline)
            
            # Si es la primera disciplina, establecerla como principal
            if not self.discipline or self.discipline.strip() == '':
                self.discipline = discipline
                
            # Guardar los cambios
            self.save()
            return True
            
        except Exception as e:
            print(f"Error al registrar disciplina: {str(e)}")
            return False
    
    def showHistory(self):
        """
        Muestra el historial deportivo del usuario
        
        Returns:
            Dict con el historial deportivo organizado
        """
        # Si no hay historial, devolver un objeto vacío
        if not self.history:
            return {
                "competitions": [],
                "achievements": [],
                "summary": {
                    "total_competitions": 0,
                    "years_active": 0,
                    "main_discipline": self.discipline if self.discipline else "No definida",
                    "disciplines": self.disciplines if self.disciplines else []
                }
            }
            
        # El historial ya está en formato de diccionario en la base de datos
        result = self.history.copy()
        
        # Añadir un resumen si no existe
        if "summary" not in result:
            # Calcular años activo
            years_active = 0
            start_year = None
            
            if "competitions" in result and result["competitions"]:
                dates = [comp.get("date") for comp in result["competitions"] if comp.get("date")]
                if dates:
                    try:
                        # Convertir fechas a objetos datetime
                        valid_dates = []
                        for d in dates:
                            try:
                                valid_dates.append(datetime.strptime(d, "%Y-%m-%d"))
                            except ValueError:
                                # Ignorar fechas inválidas
                                pass
                                
                        if valid_dates:
                            min_date = min(valid_dates)
                            max_date = max(valid_dates)
                            years_active = max_date.year - min_date.year + 1
                            start_year = min_date.year
                    except Exception:
                        # En caso de error, dejar en 0
                        pass
            
            # Crear el resumen
            result["summary"] = {
                "total_competitions": self.numCompetence,
                "years_active": years_active,
                "main_discipline": self.discipline,
                "disciplines": self.disciplines,
                "start_year": start_year
            }
            
        return result

    def __str__(self):
        user_info = f"{self.user.name} {self.user.lastName}" if hasattr(self.user, 'name') and hasattr(self.user, 'lastName') else "Usuario"
        return f"Perfil deportivo de {user_info} - {self.discipline}"
    
    class Meta:
        verbose_name = "Perfil Deportivo"
        verbose_name_plural = "Perfiles Deportivos"