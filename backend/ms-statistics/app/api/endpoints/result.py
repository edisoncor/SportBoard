from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.result_schema import ResultCreate, ResultUpdate, ResultResponse
from beanie import PydanticObjectId
from app.services.result_service import result_service

router = APIRouter(prefix="/api/v1/results", tags=["Results"])

@router.post("/", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
async def create_result(result: ResultCreate):
    """
    Crea un nuevo resultado de partido.

    Args:
        result (ResultCreate): Datos del resultado a crear.
    Returns:
        ResultResponse: Resultado creado con su información.
    """
    return await result_service.create_result(result)

@router.get("/", response_model=List[ResultResponse])
async def list_results():
    """
    Obtiene la lista de todos los resultados registrados.

    Returns:
        List[ResultResponse]: Lista de resultados.
    """
    return await result_service.list_results()

@router.get("/{result_id}", response_model=ResultResponse)
async def get_result(result_id: PydanticObjectId):
    """
    Obtiene la información de un resultado específico por su ID.

    Args:
        result_id (PydanticObjectId): ID del resultado.
    Returns:
        ResultResponse: Información del resultado solicitado.
    """
    return await result_service.get_result(result_id)

@router.put("/{result_id}", response_model=ResultResponse)
async def update_result(result_id: PydanticObjectId, result: ResultUpdate):
    """
    Actualiza la información de un resultado existente.

    Args:
        result_id (PydanticObjectId): ID del resultado a actualizar.
        result (ResultUpdate): Datos nuevos del resultado.
    Returns:
        ResultResponse: Resultado actualizado.
    """
    return await result_service.update_result(result_id, result)

@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_result(result_id: PydanticObjectId):
    """
    Elimina un resultado del sistema por su ID.

    Args:
        result_id (PydanticObjectId): ID del resultado a eliminar.
    Returns:
        None
    """
    await result_service.delete_result(result_id)
    return None
