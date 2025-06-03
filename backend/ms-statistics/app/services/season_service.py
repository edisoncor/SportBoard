"""
Servicio para la gestión de temporadas en el sistema de estadísticas deportivas.

Incluye la lógica para crear, listar, obtener, actualizar y eliminar temporadas.
"""

from app.repositories.season_repository import SeasonRepository
from app.schemas.season_schema import SeasonCreate, SeasonUpdate, SeasonResponse
from beanie import PydanticObjectId
from fastapi import HTTPException

class SeasonService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de temporadas.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de temporadas.
        """
        self.repo = SeasonRepository()

    async def create_season(self, season: SeasonCreate) -> SeasonResponse:
        """
        Crea una nueva temporada en la base de datos.

        Args:
            season (SeasonCreate): Datos de la temporada a crear.
        Returns:
            SeasonResponse: Temporada creada.
        """
        doc = await self.repo.create(season.dict())
        return SeasonResponse(**doc.dict())

    async def list_seasons(self) -> list[SeasonResponse]:
        """
        Obtiene la lista de todas las temporadas registradas.

        Returns:
            list[SeasonResponse]: Lista de temporadas.
        """
        seasons = await self.repo.list()
        return [SeasonResponse(**s.dict()) for s in seasons]

    async def get_season(self, season_id: PydanticObjectId) -> SeasonResponse:
        """
        Obtiene una temporada por su ID.

        Args:
            season_id (PydanticObjectId): ID de la temporada.
        Returns:
            SeasonResponse: Temporada encontrada.
        Raises:
            HTTPException: Si la temporada no existe.
        """
        season = await self.repo.get_by_id(season_id)
        if not season:
            raise HTTPException(status_code=404, detail="Season not found")
        return SeasonResponse(**season.dict())

    async def update_season(self, season_id: PydanticObjectId, season: SeasonUpdate) -> SeasonResponse:
        """
        Actualiza los datos de una temporada existente.

        Args:
            season_id (PydanticObjectId): ID de la temporada a actualizar.
            season (SeasonUpdate): Datos a actualizar.
        Returns:
            SeasonResponse: Temporada actualizada.
        Raises:
            HTTPException: Si la temporada no existe.
        """
        db_season = await self.repo.get_by_id(season_id)
        if not db_season:
            raise HTTPException(status_code=404, detail="Season not found")
        updated = await self.repo.update(season_id, season.dict(exclude_unset=True))
        return SeasonResponse(**updated.dict())

    async def delete_season(self, season_id: PydanticObjectId) -> None:
        """
        Elimina una temporada por su ID.

        Args:
            season_id (PydanticObjectId): ID de la temporada a eliminar.
        Raises:
            HTTPException: Si la temporada no existe.
        """
        deleted = await self.repo.delete(season_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Season not found")

season_service = SeasonService()
