"""
Servicio para la gestión de resultados en el sistema de estadísticas deportivas.

Incluye la lógica para crear, listar, obtener, actualizar y eliminar resultados, así como la conversión de identificadores de cadena a ObjectId para integridad con MongoDB.
"""

from app.repositories.result_repository import ResultRepository
from app.schemas.result_schema import ResultCreate, ResultUpdate, ResultResponse
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class ResultService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de resultados.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de resultados.
        """
        self.repo = ResultRepository()

    def _convert_string_ids_to_objectid(self, data: dict) -> dict:
        """
        Convierte los IDs en formato string a ObjectId para almacenar en MongoDB.

        Args:
            data (dict): Diccionario con los datos del resultado.
        Returns:
            dict: Diccionario con los IDs convertidos a ObjectId.
        """
        converted_data = data.copy()
        
        if converted_data.get('scoreboard_id'):
            converted_data['scoreboard_id'] = ObjectId(converted_data['scoreboard_id'])
        
        return converted_data

    async def create_result(self, result: ResultCreate) -> ResultResponse:
        """
        Crea un nuevo resultado en la base de datos.

        Args:
            result (ResultCreate): Datos del resultado a crear.
        Returns:
            ResultResponse: Resultado creado.
        Raises:
            HTTPException: Si ocurre un error durante la creación.
        """
        try:
            result_data = result.model_dump(exclude_unset=True)
            result_data = self._convert_string_ids_to_objectid(result_data)
            
            doc = await self.repo.create(result_data)
            
            return ResultResponse(
                id=str(doc.id),
                date_registration=doc.date_registration,
                details=doc.details,
                loser=doc.loser,
                score_local=doc.score_local,
                score_visitor=doc.score_visitor,
                winner=doc.winner,
                scoreboard_id=str(doc.scoreboard_id) if doc.scoreboard_id else None
            )
        except Exception as e:
            logger.error(f"Error creating result: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating result: {str(e)}"
            )

    async def list_results(self) -> list[ResultResponse]:
        """
        Obtiene la lista de todos los resultados registrados.

        Returns:
            list[ResultResponse]: Lista de resultados.
        Raises:
            HTTPException: Si ocurre un error al obtener los resultados.
        """
        try:
            results = await self.repo.list()
            return [
                ResultResponse(
                    id=str(result.id),
                    date_registration=result.date_registration,
                    details=result.details,
                    loser=result.loser,
                    score_local=result.score_local,
                    score_visitor=result.score_visitor,
                    winner=result.winner,
                    scoreboard_id=str(result.scoreboard_id) if result.scoreboard_id else None
                ) for result in results
            ]
        except Exception as e:
            logger.error(f"Error listing results: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving results"
            )

    async def get_result(self, result_id: PydanticObjectId) -> ResultResponse:
        """
        Obtiene un resultado por su ID.

        Args:
            result_id (PydanticObjectId): ID del resultado.
        Returns:
            ResultResponse: Resultado encontrado.
        Raises:
            HTTPException: Si el resultado no existe.
        """
        result = await self.repo.get_by_id(result_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Result not found"
            )
        
        return ResultResponse(
            id=str(result.id),
            date_registration=result.date_registration,
            details=result.details,
            loser=result.loser,
            score_local=result.score_local,
            score_visitor=result.score_visitor,
            winner=result.winner,
            scoreboard_id=str(result.scoreboard_id) if result.scoreboard_id else None
        )

    async def update_result(self, result_id: PydanticObjectId, result: ResultUpdate) -> ResultResponse:
        """
        Actualiza los datos de un resultado existente.

        Args:
            result_id (PydanticObjectId): ID del resultado a actualizar.
            result (ResultUpdate): Datos a actualizar.
        Returns:
            ResultResponse: Resultado actualizado.
        Raises:
            HTTPException: Si el resultado no existe.
        """
        db_result = await self.repo.get_by_id(result_id)
        if not db_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Result not found"
            )
        
        update_data = result.model_dump(exclude_unset=True)
        update_data = self._convert_string_ids_to_objectid(update_data)
        
        updated = await self.repo.update(result_id, update_data)
        
        return ResultResponse(
            id=str(updated.id),
            date_registration=updated.date_registration,
            details=updated.details,
            loser=updated.loser,
            score_local=updated.score_local,
            score_visitor=updated.score_visitor,
            winner=updated.winner,
            scoreboard_id=str(updated.scoreboard_id) if updated.scoreboard_id else None
        )

    async def delete_result(self, result_id: PydanticObjectId) -> None:
        """
        Elimina un resultado por su ID.

        Args:
            result_id (PydanticObjectId): ID del resultado a eliminar.
        Raises:
            HTTPException: Si el resultado no existe.
        """
        deleted = await self.repo.delete(result_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Result not found"
            )

result_service = ResultService()