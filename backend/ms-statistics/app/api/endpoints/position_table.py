from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.position_table import PositionTable
from app.schemas.position_table_schema import PositionTableCreate, PositionTableUpdate, PositionTableResponse
from beanie import PydanticObjectId

router = APIRouter(prefix="/api/v1/position_tables", tags=["PositionTables"])

@router.post("/", response_model=PositionTableResponse, status_code=status.HTTP_201_CREATED)
async def create_position_table(position_table: PositionTableCreate):
    """
    Crea una nueva tabla de posiciones.

    Args:
        position_table (PositionTableCreate): Datos de la tabla de posiciones a crear.
    Returns:
        PositionTableResponse: Tabla de posiciones creada.
    """
    position_table_doc = PositionTable(**position_table.dict())
    await position_table_doc.insert()
    return PositionTableResponse(**position_table_doc.dict())

@router.get("/", response_model=List[PositionTableResponse])
async def list_position_tables():
    """
    Obtiene la lista de todas las tablas de posiciones registradas.

    Returns:
        List[PositionTableResponse]: Lista de tablas de posiciones.
    """
    position_tables = await PositionTable.find_all().to_list()
    return [PositionTableResponse(**p.dict()) for p in position_tables]

@router.get("/{position_table_id}", response_model=PositionTableResponse)
async def get_position_table(position_table_id: PydanticObjectId):
    """
    Obtiene la información de una tabla de posiciones específica por su ID.

    Args:
        position_table_id (PydanticObjectId): ID de la tabla de posiciones.
    Returns:
        PositionTableResponse: Información de la tabla de posiciones solicitada.
    """
    position_table = await PositionTable.get(position_table_id)
    if not position_table:
        raise HTTPException(status_code=404, detail="PositionTable not found")
    return PositionTableResponse(**position_table.dict())

@router.put("/{position_table_id}", response_model=PositionTableResponse)
async def update_position_table(position_table_id: PydanticObjectId, position_table: PositionTableUpdate):
    """
    Actualiza la información de una tabla de posiciones existente.

    Args:
        position_table_id (PydanticObjectId): ID de la tabla de posiciones a actualizar.
        position_table (PositionTableUpdate): Datos nuevos de la tabla de posiciones.
    Returns:
        PositionTableResponse: Tabla de posiciones actualizada.
    """
    db_position_table = await PositionTable.get(position_table_id)
    if not db_position_table:
        raise HTTPException(status_code=404, detail="PositionTable not found")
    await db_position_table.set({k: v for k, v in position_table.dict(exclude_unset=True).items()})
    return PositionTableResponse(**db_position_table.dict())

@router.delete("/{position_table_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_position_table(position_table_id: PydanticObjectId):
    """
    Elimina una tabla de posiciones por su ID.

    Args:
        position_table_id (PydanticObjectId): ID de la tabla de posiciones a eliminar.
    Returns:
        None
    """
    position_table = await PositionTable.get(position_table_id)
    if not position_table:
        raise HTTPException(status_code=404, detail="PositionTable not found")
    await position_table.delete()
    return None
