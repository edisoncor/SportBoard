"""
Repositorio para la entidad EventMatch. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.event_match import EventMatch

class EventMatchRepository(BaseRepository):
    """
    Repositorio específico para la entidad EventMatch.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo EventMatch.
        """
        super().__init__(EventMatch)
