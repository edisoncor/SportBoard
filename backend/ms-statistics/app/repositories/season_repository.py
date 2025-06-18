"""
Repositorio para la entidad Season. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.season import Season

class SeasonRepository(BaseRepository):
    """
    Repositorio específico para la entidad Season.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Season.
        """
        super().__init__(Season)
