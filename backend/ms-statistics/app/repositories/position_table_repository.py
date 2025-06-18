"""
Repositorio para la entidad PositionTable. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.position_table import PositionTable

class PositionTableRepository(BaseRepository):
    """
    Repositorio específico para la entidad PositionTable.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo PositionTable.
        """
        super().__init__(PositionTable)
