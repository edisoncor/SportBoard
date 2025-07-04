"""
Repositorio para la entidad Árbitro. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.arbitre import Arbitre

class ArbitreRepository(BaseRepository):
    """
    Repositorio específico para la entidad Arbitre.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Arbitre.
        """
        super().__init__(Arbitre)
