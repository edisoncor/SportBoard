"""
Repositorio para la entidad StatisticIndividual. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.statistic_individual import StatisticIndividual

class StatisticIndividualRepository(BaseRepository):
    """
    Repositorio específico para la entidad StatisticIndividual.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo StatisticIndividual.
        """
        super().__init__(StatisticIndividual)
