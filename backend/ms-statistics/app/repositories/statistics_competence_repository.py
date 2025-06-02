"""
Repositorio para la entidad StatisticCompetence. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.statistics_competence import StatisticCompetence

class StatisticCompetenceRepository(BaseRepository):
    """
    Repositorio específico para la entidad StatisticCompetence.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo StatisticCompetence.
        """
        super().__init__(StatisticCompetence)
