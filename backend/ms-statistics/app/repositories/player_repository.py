"""
Repositorio para la entidad Athlete (jugador). Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.athlete import Athlete

class PlayerRepository(BaseRepository):
    """
    Repositorio específico para la entidad Athlete (jugador).
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Athlete.
        """
        super().__init__(Athlete)
