"""
Repositorio para la entidad Team. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.team import Team

class TeamRepository(BaseRepository):
    """
    Repositorio específico para la entidad Team.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Team.
        """
        super().__init__(Team)
