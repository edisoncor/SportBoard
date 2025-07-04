"""
Repositorio para la entidad Scoreboard. Hereda operaciones CRUD del repositorio base y agrega búsqueda por match_id.
"""

from .base_repository import BaseRepository
from app.models.scoreboard import Scoreboard

class ScoreboardRepository(BaseRepository):
    """
    Repositorio específico para la entidad Scoreboard. Incluye método para buscar por match_id.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo Scoreboard.
        """
        super().__init__(Scoreboard)
        
    async def find_one(self, match_id: str):
        """
        Busca un scoreboard por match_id.
        :param match_id: ID del partido.
        :return: Scoreboard encontrado o None si no existe.
        """
        from bson import ObjectId
        return await self.model.find_one({"match_id": ObjectId(match_id)})