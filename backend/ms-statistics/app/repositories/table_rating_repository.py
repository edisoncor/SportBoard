"""
Repositorio para la entidad TableRating. Hereda operaciones CRUD del repositorio base.
"""

from .base_repository import BaseRepository
from app.models.table_rating import TableRating

class TableRatingRepository(BaseRepository):
    """
    Repositorio específico para la entidad TableRating.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo TableRating.
        """
        super().__init__(TableRating)
