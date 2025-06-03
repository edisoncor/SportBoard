"""
Servicio para la gestión de tablas de posiciones en el sistema de estadísticas deportivas.

Incluye la lógica para crear, listar, obtener, actualizar y eliminar registros de la tabla de posiciones, así como la conversión de identificadores de cadena a ObjectId para integridad con MongoDB.
"""

from app.repositories.position_table_repository import PositionTableRepository
from app.schemas.position_table_schema import PositionTableCreate, PositionTableUpdate, PositionTableResponse
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class PositionTableService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de la tabla de posiciones.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de tabla de posiciones.
        """
        self.repo = PositionTableRepository()

    def _convert_string_ids_to_objectid(self, data: dict) -> dict:
        """
        Convierte los IDs en formato string a ObjectId para almacenar en MongoDB.

        Args:
            data (dict): Diccionario con los datos de la tabla de posiciones.
        Returns:
            dict: Diccionario con los IDs convertidos a ObjectId.
        """
        converted_data = data.copy()
        
        # Convertir table_rating_id
        if converted_data.get('table_rating_id'):
            converted_data['table_rating_id'] = ObjectId(converted_data['table_rating_id'])
        
        # Convertir team_id
        if converted_data.get('team_id'):
            converted_data['team_id'] = ObjectId(converted_data['team_id'])
        
        return converted_data

    async def create_position_table(self, position_table: PositionTableCreate) -> PositionTableResponse:
        """
        Crea un nuevo registro de tabla de posiciones en la base de datos.

        Args:
            position_table (PositionTableCreate): Datos del registro a crear.
        Returns:
            PositionTableResponse: Registro creado.
        Raises:
            HTTPException: Si ocurre un error durante la creación.
        """
        try:
            pt_data = position_table.model_dump(exclude_unset=True)
            pt_data = self._convert_string_ids_to_objectid(pt_data)
            
            doc = await self.repo.create(pt_data)
            
            return PositionTableResponse(
                id=str(doc.id),
                position=doc.position,
                points_total=doc.points_total,
                table_rating_id=str(doc.table_rating_id) if doc.table_rating_id else None,
                team_id=str(doc.team_id) if doc.team_id else None
            )
        except Exception as e:
            logger.error(f"Error creating position table: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating position table: {str(e)}"
            )

    async def list_position_tables(self) -> list[PositionTableResponse]:
        """
        Obtiene la lista de todos los registros de la tabla de posiciones.

        Returns:
            list[PositionTableResponse]: Lista de registros de la tabla de posiciones.
        Raises:
            HTTPException: Si ocurre un error al obtener los registros.
        """
        try:
            pts = await self.repo.list()
            return [
                PositionTableResponse(
                    id=str(pt.id),
                    position=pt.position,
                    points_total=pt.points_total,
                    table_rating_id=str(pt.table_rating_id) if pt.table_rating_id else None,
                    team_id=str(pt.team_id) if pt.team_id else None
                ) for pt in pts
            ]
        except Exception as e:
            logger.error(f"Error listing position tables: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving position tables"
            )

    async def get_position_table(self, position_table_id: PydanticObjectId) -> PositionTableResponse:
        """
        Obtiene un registro de la tabla de posiciones por su ID.

        Args:
            position_table_id (PydanticObjectId): ID del registro.
        Returns:
            PositionTableResponse: Registro encontrado.
        Raises:
            HTTPException: Si el registro no existe.
        """
        pt = await self.repo.get_by_id(position_table_id)
        if not pt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="PositionTable not found"
            )
        
        return PositionTableResponse(
            id=str(pt.id),
            position=pt.position,
            points_total=pt.points_total,
            table_rating_id=str(pt.table_rating_id) if pt.table_rating_id else None,
            team_id=str(pt.team_id) if pt.team_id else None
        )

    async def update_position_table(self, position_table_id: PydanticObjectId, position_table: PositionTableUpdate) -> PositionTableResponse:
        """
        Actualiza los datos de un registro de la tabla de posiciones existente.

        Args:
            position_table_id (PydanticObjectId): ID del registro a actualizar.
            position_table (PositionTableUpdate): Datos a actualizar.
        Returns:
            PositionTableResponse: Registro actualizado.
        Raises:
            HTTPException: Si el registro no existe.
        """
        db_pt = await self.repo.get_by_id(position_table_id)
        if not db_pt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="PositionTable not found"
            )
        
        # ✅ CORREGIDO: Usar model_dump() con exclude_unset y convertir IDs
        update_data = position_table.model_dump(exclude_unset=True)
        update_data = self._convert_string_ids_to_objectid(update_data)
        
        updated = await self.repo.update(position_table_id, update_data)
        
        return PositionTableResponse(
            id=str(updated.id),
            position=updated.position,
            points_total=updated.points_total,
            table_rating_id=str(updated.table_rating_id) if updated.table_rating_id else None,
            team_id=str(updated.team_id) if updated.team_id else None
        )

    async def delete_position_table(self, position_table_id: PydanticObjectId) -> None:
        """
        Elimina un registro de la tabla de posiciones por su ID.

        Args:
            position_table_id (PydanticObjectId): ID del registro a eliminar.
        Raises:
            HTTPException: Si el registro no existe.
        """
        deleted = await self.repo.delete(position_table_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="PositionTable not found"
            )

position_table_service = PositionTableService()