"""
Repositorio para la entidad StatisticSeason. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.statistic_season import StatisticSeason

class StatisticSeasonRepository(BaseRepository):
    """
    Repositorio específico para la entidad StatisticSeason.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo StatisticSeason.
        """
        super().__init__(StatisticSeason)
