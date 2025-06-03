from fastapi import APIRouter, HTTPException, status
from typing import List
from beanie import PydanticObjectId
from app.schemas.statistics_season_schema import (
    StatisticSeasonCreate,
    StatisticSeasonUpdate,
    StatisticSeasonResponse,
)
from app.services.statistics_season_service import statistic_season_service

router = APIRouter(prefix="/api/v1/statistics/season", tags=["StatisticSeasons"])

@router.post("/", response_model=StatisticSeasonResponse, status_code=status.HTTP_201_CREATED)
async def create_statistic_season(stat: StatisticSeasonCreate):
    """
    Crea una nueva estadística de temporada.

    Args:
        stat (StatisticSeasonCreate): Datos de la estadística de temporada a crear.
    Returns:
        StatisticSeasonResponse: Estadística de temporada creada.
    """
    return await statistic_season_service.create_statistic_season(stat)

@router.get("/", response_model=List[StatisticSeasonResponse])
async def list_statistic_seasons():
    """
    Obtiene la lista de todas las estadísticas de temporada registradas.

    Returns:
        List[StatisticSeasonResponse]: Lista de estadísticas de temporada.
    """
    return await statistic_season_service.list_statistic_seasons()

@router.get("/{stat_id}", response_model=StatisticSeasonResponse)
async def get_statistic_season(stat_id: PydanticObjectId):
    """
    Obtiene la información de una estadística de temporada específica por su ID.

    Args:
        stat_id (PydanticObjectId): ID de la estadística de temporada.
    Returns:
        StatisticSeasonResponse: Información de la estadística de temporada solicitada.
    """
    return await statistic_season_service.get_statistic_season(stat_id)

@router.put("/{stat_id}", response_model=StatisticSeasonResponse)
async def update_statistic_season(stat_id: PydanticObjectId, stat: StatisticSeasonUpdate):
    """
    Actualiza la información de una estadística de temporada existente.

    Args:
        stat_id (PydanticObjectId): ID de la estadística de temporada a actualizar.
        stat (StatisticSeasonUpdate): Datos nuevos de la estadística de temporada.
    Returns:
        StatisticSeasonResponse: Estadística de temporada actualizada.
    """
    return await statistic_season_service.update_statistic_season(stat_id, stat)

@router.delete("/{stat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_statistic_season(stat_id: PydanticObjectId):
    """
    Elimina una estadística de temporada del sistema por su ID.

    Args:
        stat_id (PydanticObjectId): ID de la estadística de temporada a eliminar.
    Returns:
        None
    """
    await statistic_season_service.delete_statistic_season(stat_id)
    return None
