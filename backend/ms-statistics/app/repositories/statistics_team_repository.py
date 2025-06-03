"""
Repositorio para la entidad StatisticTeam. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.statistic_team import StatisticTeam

class StatisticTeamRepository(BaseRepository):
    """
    Repositorio específico para la entidad StatisticTeam.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo StatisticTeam.
        """
        super().__init__(StatisticTeam)
