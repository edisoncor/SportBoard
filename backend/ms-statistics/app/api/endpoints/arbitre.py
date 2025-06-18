from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.arbitre_schema import ArbitreCreate, ArbitreUpdate, ArbitreResponse
from beanie import PydanticObjectId
from app.services.arbitre_service import arbitre_service

router = APIRouter(prefix="/api/v1/arbitres", tags=["Arbitres"])

@router.post("/", response_model=ArbitreResponse, status_code=status.HTTP_201_CREATED)
async def create_arbitre(arbitre: ArbitreCreate):
    """
    Crea un nuevo árbitro en el sistema.

    Args:
        arbitre (ArbitreCreate): Datos del árbitro a crear.
    Returns:
        ArbitreResponse: Árbitro creado con su información.
    """
    return await arbitre_service.create_arbitre(arbitre)

@router.get("/", response_model=List[ArbitreResponse])
async def list_arbitres():
    """
    Obtiene la lista de todos los árbitros registrados.

    Returns:
        List[ArbitreResponse]: Lista de árbitros.
    """
    return await arbitre_service.list_arbitres()

@router.get("/{arbitre_id}", response_model=ArbitreResponse)
async def get_arbitre(arbitre_id: PydanticObjectId):
    """
    Obtiene la información de un árbitro específico por su ID.

    Args:
        arbitre_id (PydanticObjectId): ID del árbitro.
    Returns:
        ArbitreResponse: Información del árbitro solicitado.
    """
    return await arbitre_service.get_arbitre(arbitre_id)

@router.put("/{arbitre_id}", response_model=ArbitreResponse)
async def update_arbitre(arbitre_id: PydanticObjectId, arbitre: ArbitreUpdate):
    """
    Actualiza la información de un árbitro existente.

    Args:
        arbitre_id (PydanticObjectId): ID del árbitro a actualizar.
        arbitre (ArbitreUpdate): Datos nuevos del árbitro.
    Returns:
        ArbitreResponse: Árbitro actualizado.
    """
    return await arbitre_service.update_arbitre(arbitre_id, arbitre)

@router.delete("/{arbitre_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_arbitre(arbitre_id: PydanticObjectId):
    """
    Elimina un árbitro del sistema por su ID.

    Args:
        arbitre_id (PydanticObjectId): ID del árbitro a eliminar.
    Returns:
        None
    """
    await arbitre_service.delete_arbitre(arbitre_id)
    return None
