from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.team_schema import TeamCreate, TeamUpdate, TeamResponse
from beanie import PydanticObjectId
from app.services.team_service import team_service

router = APIRouter(prefix="/api/v1/teams", tags=["Teams"])

@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(team: TeamCreate):
    """
    Crea un nuevo equipo.

    Args:
        team (TeamCreate): Datos del equipo a crear.
    Returns:
        TeamResponse: Equipo creado con su información.
    """
    return await team_service.create_team(team)

@router.get("/", response_model=List[TeamResponse])
async def list_teams():
    """
    Obtiene la lista de todos los equipos registrados.

    Returns:
        List[TeamResponse]: Lista de equipos.
    """
    return await team_service.list_teams()

@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: PydanticObjectId):
    """
    Obtiene la información de un equipo específico por su ID.

    Args:
        team_id (PydanticObjectId): ID del equipo.
    Returns:
        TeamResponse: Información del equipo solicitado.
    """
    return await team_service.get_team(team_id)

@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(team_id: PydanticObjectId, team: TeamUpdate):
    """
    Actualiza la información de un equipo existente.

    Args:
        team_id (PydanticObjectId): ID del equipo a actualizar.
        team (TeamUpdate): Datos nuevos del equipo.
    Returns:
        TeamResponse: Equipo actualizado.
    """
    return await team_service.update_team(team_id, team)

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(team_id: PydanticObjectId):
    """
    Elimina un equipo del sistema por su ID.

    Args:
        team_id (PydanticObjectId): ID del equipo a eliminar.
    Returns:
        None
    """
    await team_service.delete_team(team_id)
    return None
