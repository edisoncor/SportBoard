from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.season_schema import SeasonCreate, SeasonUpdate, SeasonResponse
from beanie import PydanticObjectId
from app.services.season_service import season_service

router = APIRouter(prefix="/api/v1/seasons", tags=["Seasons"])

@router.post("/", response_model=SeasonResponse, status_code=status.HTTP_201_CREATED)
async def create_season(season: SeasonCreate):
    """
    Crea una nueva temporada.

    Args:
        season (SeasonCreate): Datos de la temporada a crear.
    Returns:
        SeasonResponse: Temporada creada con su información.
    """
    return await season_service.create_season(season)

@router.get("/", response_model=List[SeasonResponse])
async def list_seasons():
    """
    Obtiene la lista de todas las temporadas registradas.

    Returns:
        List[SeasonResponse]: Lista de temporadas.
    """
    return await season_service.list_seasons()

@router.get("/{season_id}", response_model=SeasonResponse)
async def get_season(season_id: PydanticObjectId):
    """
    Obtiene la información de una temporada específica por su ID.

    Args:
        season_id (PydanticObjectId): ID de la temporada.
    Returns:
        SeasonResponse: Información de la temporada solicitada.
    """
    return await season_service.get_season(season_id)

@router.put("/{season_id}", response_model=SeasonResponse)
async def update_season(season_id: PydanticObjectId, season: SeasonUpdate):
    """
    Actualiza la información de una temporada existente.

    Args:
        season_id (PydanticObjectId): ID de la temporada a actualizar.
        season (SeasonUpdate): Datos nuevos de la temporada.
    Returns:
        SeasonResponse: Temporada actualizada.
    """
    return await season_service.update_season(season_id, season)

@router.delete("/{season_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_season(season_id: PydanticObjectId):
    """
    Elimina una temporada del sistema por su ID.

    Args:
        season_id (PydanticObjectId): ID de la temporada a eliminar.
    Returns:
        None
    """
    await season_service.delete_season(season_id)
    return None
