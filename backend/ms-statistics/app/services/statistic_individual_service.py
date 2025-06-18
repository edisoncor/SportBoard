"""
Servicio para la gestión de estadísticas individuales en el sistema de estadísticas deportivas.

Incluye la lógica para crear, listar, obtener, actualizar y eliminar estadísticas individuales de atletas, así como la conversión de identificadores de atleta a ObjectId para integridad con MongoDB.
"""

import logging
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from bson import ObjectId

from app.repositories.statistic_individual_repository import StatisticIndividualRepository
from app.schemas.statistic_individual_schema import (
    StatisticIndividualCreate,
    StatisticIndividualUpdate,
    StatisticIndividualResponse,
)

logger = logging.getLogger(__name__)

class StatisticIndividualService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de estadísticas individuales.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de estadísticas individuales.
        """
        self.repo = StatisticIndividualRepository()

    async def create_statistic(self, data: StatisticIndividualCreate) -> StatisticIndividualResponse:
        """
        Crea una nueva estadística individual en la base de datos.

        Args:
            data (StatisticIndividualCreate): Datos de la estadística a crear.
        Returns:
            StatisticIndividualResponse: Estadística individual creada.
        Raises:
            HTTPException: Si ocurre un error durante la creación.
        """
        try:
            stat_data = data.model_dump(exclude_unset=True)

            if "athlete_id" in stat_data and stat_data["athlete_id"]:
                stat_data["athlete_id"] = ObjectId(stat_data["athlete_id"])

            doc = await self.repo.create(stat_data)
            return StatisticIndividualResponse(
                id=str(doc.id),
                description=doc.description,
                date_generation=doc.date_generation,
                value=doc.value,
                goal=doc.goal,
                own_goal=doc.own_goal,
                foul=doc.foul,
                red_card=doc.red_card,
                yellow_card=doc.yellow_card,
                athlete_id=str(doc.athlete_id) if doc.athlete_id else None,
            )
        except Exception as e:
            logger.error(f"Error creating statistic individual: {str(e)}")
            raise HTTPException(status_code=500, detail="Error creating statistic individual")

    async def list_statistics(self) -> list[StatisticIndividualResponse]:
        """
        Obtiene la lista de todas las estadísticas individuales registradas.

        Returns:
            list[StatisticIndividualResponse]: Lista de estadísticas individuales.
        Raises:
            HTTPException: Si ocurre un error al obtener las estadísticas.
        """
        try:
            records = await self.repo.list()
            return [
                StatisticIndividualResponse(
                    id=str(r.id),
                    description=r.description,
                    date_generation=r.date_generation,
                    value=r.value,
                    goal=r.goal,
                    own_goal=r.own_goal,
                    foul=r.foul,
                    red_card=r.red_card,
                    yellow_card=r.yellow_card,
                    athlete_id=str(r.athlete_id) if r.athlete_id else None,
                ) for r in records
            ]
        except Exception as e:
            logger.error(f"Error listing statistics: {str(e)}")
            raise HTTPException(status_code=500, detail="Error listing statistic individual")

    async def get_statistic(self, stat_id: PydanticObjectId) -> StatisticIndividualResponse:
        """
        Obtiene una estadística individual por su ID.

        Args:
            stat_id (PydanticObjectId): ID de la estadística individual.
        Returns:
            StatisticIndividualResponse: Estadística individual encontrada.
        Raises:
            HTTPException: Si la estadística no existe.
        """
        stat = await self.repo.get_by_id(stat_id)
        if not stat:
            raise HTTPException(status_code=404, detail="Statistic not found")

        return StatisticIndividualResponse(
            id=str(stat.id),
            description=stat.description,
            date_generation=stat.date_generation,
            value=stat.value,
            goal=stat.goal,
            own_goal=stat.own_goal,
            foul=stat.foul,
            red_card=stat.red_card,
            yellow_card=stat.yellow_card,
            athlete_id=str(stat.athlete_id) if stat.athlete_id else None,
        )

    async def update_statistic(self, stat_id: PydanticObjectId, data: StatisticIndividualUpdate) -> StatisticIndividualResponse:
        """
        Actualiza los datos de una estadística individual existente.

        Args:
            stat_id (PydanticObjectId): ID de la estadística a actualizar.
            data (StatisticIndividualUpdate): Datos a actualizar.
        Returns:
            StatisticIndividualResponse: Estadística individual actualizada.
        Raises:
            HTTPException: Si la estadística no existe.
        """
        db_stat = await self.repo.get_by_id(stat_id)
        if not db_stat:
            raise HTTPException(status_code=404, detail="Statistic not found")

        update_data = data.model_dump(exclude_unset=True)

        if "athlete_id" in update_data and update_data["athlete_id"]:
            update_data["athlete_id"] = ObjectId(update_data["athlete_id"])

        updated = await self.repo.update(stat_id, update_data)
        return StatisticIndividualResponse(
            id=str(updated.id),
            description=updated.description,
            date_generation=updated.date_generation,
            value=updated.value,
            goal=updated.goal,
            own_goal=updated.own_goal,
            foul=updated.foul,
            red_card=updated.red_card,
            yellow_card=updated.yellow_card,
            athlete_id=str(updated.athlete_id) if updated.athlete_id else None,
        )

    async def delete_statistic(self, stat_id: PydanticObjectId) -> None:
        """
        Elimina una estadística individual por su ID.

        Args:
            stat_id (PydanticObjectId): ID de la estadística a eliminar.
        Raises:
            HTTPException: Si la estadística no existe.
        """
        deleted = await self.repo.delete(stat_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Statistic not found")

statistic_individual_service = StatisticIndividualService()
