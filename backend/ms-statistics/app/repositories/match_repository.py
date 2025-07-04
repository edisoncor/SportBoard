"""
Repositorio para la entidad Match. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.match import Match

class MatchRepository(BaseRepository):
    """
    Repositorio específico para la entidad Match.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Match.
        """
        super().__init__(Match)
