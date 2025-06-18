"""
Servicio para la gestión de tablas de calificación (table ratings) en el sistema de estadísticas deportivas.

Incluye la lógica para crear, listar, obtener, actualizar y eliminar tablas de calificación, así como la conversión de identificadores de competición y posiciones a ObjectId para integridad con MongoDB.
"""

# app/services/table_rating_service.py - VERSIÓN CORREGIDA
from app.repositories.table_rating_repository import TableRatingRepository
from app.schemas.table_rating_schema import TableRatingCreate, TableRatingUpdate, TableRatingResponse
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class TableRatingService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de tablas de calificación.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de tablas de calificación.
        """
        self.repo = TableRatingRepository()

    def _convert_string_ids_to_objectid(self, data: dict) -> dict:
        """
        Convierte los IDs en formato string a ObjectId para almacenar en MongoDB.

        Args:
            data (dict): Diccionario con los datos de la tabla de calificación.
        Returns:
            dict: Diccionario con los IDs convertidos a ObjectId.
        """
        converted_data = data.copy()
        
        if converted_data.get('competition_id'):
            converted_data['competition_id'] = ObjectId(converted_data['competition_id'])
        
        if converted_data.get('positions'):
            converted_data['positions'] = [
                ObjectId(id_str) for id_str in converted_data['positions']
            ]
        
        return converted_data

    async def create_table_rating(self, table_rating: TableRatingCreate) -> TableRatingResponse:
        """
        Crea una nueva tabla de calificación en la base de datos.

        Args:
            table_rating (TableRatingCreate): Datos de la tabla de calificación a crear.
        Returns:
            TableRatingResponse: Tabla de calificación creada.
        Raises:
            HTTPException: Si ocurre un error durante la creación.
        """
        try:
            tr_data = table_rating.model_dump(exclude_unset=True)
            tr_data = self._convert_string_ids_to_objectid(tr_data)
            
            doc = await self.repo.create(tr_data)
            
            return TableRatingResponse(
                id=str(doc.id),
                last_update=doc.last_update,
                competition_id=str(doc.competition_id) if doc.competition_id else None,
                positions=[str(pos_id) for pos_id in doc.positions]
            )
        except Exception as e:
            logger.error(f"Error creating table rating: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating table rating: {str(e)}"
            )

    async def list_table_ratings(self) -> list[TableRatingResponse]:
        """
        Obtiene la lista de todas las tablas de calificación registradas.

        Returns:
            list[TableRatingResponse]: Lista de tablas de calificación.
        Raises:
            HTTPException: Si ocurre un error al obtener las tablas.
        """
        try:
            trs = await self.repo.list()
            return [
                TableRatingResponse(
                    id=str(tr.id),
                    last_update=tr.last_update,
                    competition_id=str(tr.competition_id) if tr.competition_id else None,
                    positions=[str(pos_id) for pos_id in tr.positions]
                ) for tr in trs
            ]
        except Exception as e:
            logger.error(f"Error listing table ratings: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving table ratings"
            )

    async def get_table_rating(self, table_rating_id: PydanticObjectId) -> TableRatingResponse:
        """
        Obtiene una tabla de calificación por su ID.

        Args:
            table_rating_id (PydanticObjectId): ID de la tabla de calificación.
        Returns:
            TableRatingResponse: Tabla de calificación encontrada.
        Raises:
            HTTPException: Si la tabla no existe.
        """
        tr = await self.repo.get_by_id(table_rating_id)
        if not tr:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="TableRating not found"
            )
        
        return TableRatingResponse(
            id=str(tr.id),
            last_update=tr.last_update,
            competition_id=str(tr.competition_id) if tr.competition_id else None,
            positions=[str(pos_id) for pos_id in tr.positions]
        )

    async def update_table_rating(self, table_rating_id: PydanticObjectId, table_rating: TableRatingUpdate) -> TableRatingResponse:
        """
        Actualiza los datos de una tabla de calificación existente.

        Args:
            table_rating_id (PydanticObjectId): ID de la tabla a actualizar.
            table_rating (TableRatingUpdate): Datos a actualizar.
        Returns:
            TableRatingResponse: Tabla de calificación actualizada.
        Raises:
            HTTPException: Si la tabla no existe.
        """
        db_tr = await self.repo.get_by_id(table_rating_id)
        if not db_tr:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="TableRating not found"
            )
        
        update_data = table_rating.model_dump(exclude_unset=True)
        update_data = self._convert_string_ids_to_objectid(update_data)
        
        updated = await self.repo.update(table_rating_id, update_data)
        
        return TableRatingResponse(
            id=str(updated.id),
            last_update=updated.last_update,
            competition_id=str(updated.competition_id) if updated.competition_id else None,
            positions=[str(pos_id) for pos_id in updated.positions]
        )

    async def delete_table_rating(self, table_rating_id: PydanticObjectId) -> None:
        """
        Elimina una tabla de calificación por su ID.

        Args:
            table_rating_id (PydanticObjectId): ID de la tabla a eliminar.
        Raises:
            HTTPException: Si la tabla no existe.
        """
        deleted = await self.repo.delete(table_rating_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="TableRating not found"
            )

table_rating_service = TableRatingService()