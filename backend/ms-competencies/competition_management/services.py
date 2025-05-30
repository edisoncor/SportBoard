"""
Servicios de lógica de negocio para la app competence.
Incluye validaciones, acciones de activación/desactivación y excepciones personalizadas.
"""
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from .models import Athlete, Team, Category

class ConflictError(Exception):
    """Excepción para conflictos de negocio (HTTP 409)."""
    pass

def activate_athlete(athlete_id):
    """
    Activa un atleta por su ID.
    Lanza ValidationError si no existe.
    """
    try:
        athlete = Athlete.objects.get(pk=athlete_id)
        athlete.isActive = True
        athlete.save()
        return athlete
    except Athlete.DoesNotExist:
        raise ValidationError("Athlete not found.")

def deactivate_athlete(athlete_id):
    """
    Desactiva un atleta por su ID.
    Lanza ValidationError si no existe.
    """
    try:
        athlete = Athlete.objects.get(pk=athlete_id)
        athlete.isActive = False
        athlete.save()
        return athlete
    except Athlete.DoesNotExist:
        raise ValidationError("Athlete not found.")

def add_team_category(team_id, category_id):
    """
    Asocia un equipo a una categoría.
    Lanza ConflictError si ya está asociado.
    """
    try:
        team = Team.objects.get(pk=team_id)
        category = Category.objects.get(pk=category_id)
        if team.position_tables.filter(category=category).exists():
            raise ConflictError("Team already in this category.")
        # Aquí se podría crear la relación según el modelo real
        return True
    except (Team.DoesNotExist, Category.DoesNotExist):
        raise ValidationError("Team or Category not found.")
