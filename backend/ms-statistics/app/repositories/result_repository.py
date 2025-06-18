"""
Repositorio para la entidad Result. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.result import Result

class ResultRepository(BaseRepository):
    """
    Repositorio específico para la entidad Result.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Result.
        """
        super().__init__(Result)
