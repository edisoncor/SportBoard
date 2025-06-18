"""
Servicio para la gestión de árbitros en el sistema de estadísticas deportivas.

Proporciona métodos para crear, listar, obtener, actualizar y eliminar árbitros utilizando el repositorio correspondiente.
"""

from app.repositories.arbitre_repository import ArbitreRepository
from app.schemas.arbitre_schema import ArbitreCreate, ArbitreUpdate, ArbitreResponse
from beanie import PydanticObjectId
from fastapi import HTTPException

class ArbitreService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de árbitros.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de árbitros.
        """
        self.repo = ArbitreRepository()

    async def create_arbitre(self, arbitre: ArbitreCreate) -> ArbitreResponse:
        """
        Crea un nuevo árbitro en la base de datos.

        Args:
            arbitre (ArbitreCreate): Datos del árbitro a crear.
        Returns:
            ArbitreResponse: Árbitro creado.
        """
        doc = await self.repo.create(arbitre.dict())
        return ArbitreResponse(**doc.dict())

    async def list_arbitres(self) -> list[ArbitreResponse]:
        """
        Obtiene la lista de todos los árbitros registrados.

        Returns:
            list[ArbitreResponse]: Lista de árbitros.
        """
        arbitres = await self.repo.list()
        return [ArbitreResponse(**a.dict()) for a in arbitres]

    async def get_arbitre(self, arbitre_id: PydanticObjectId) -> ArbitreResponse:
        """
        Obtiene un árbitro por su ID.

        Args:
            arbitre_id (PydanticObjectId): ID del árbitro.
        Returns:
            ArbitreResponse: Árbitro encontrado.
        Raises:
            HTTPException: Si el árbitro no existe.
        """
        arbitre = await self.repo.get_by_id(arbitre_id)
        if not arbitre:
            raise HTTPException(status_code=404, detail="Arbitre not found")
        return ArbitreResponse(**arbitre.dict())

    async def update_arbitre(self, arbitre_id: PydanticObjectId, arbitre: ArbitreUpdate) -> ArbitreResponse:
        """
        Actualiza los datos de un árbitro existente.

        Args:
            arbitre_id (PydanticObjectId): ID del árbitro a actualizar.
            arbitre (ArbitreUpdate): Datos a actualizar.
        Returns:
            ArbitreResponse: Árbitro actualizado.
        Raises:
            HTTPException: Si el árbitro no existe.
        """
        db_arbitre = await self.repo.get_by_id(arbitre_id)
        if not db_arbitre:
            raise HTTPException(status_code=404, detail="Arbitre not found")
        updated = await self.repo.update(arbitre_id, arbitre.dict(exclude_unset=True))
        return ArbitreResponse(**updated.dict())

    async def delete_arbitre(self, arbitre_id: PydanticObjectId) -> None:
        """
        Elimina un árbitro por su ID.

        Args:
            arbitre_id (PydanticObjectId): ID del árbitro a eliminar.
        Raises:
            HTTPException: Si el árbitro no existe.
        """
        deleted = await self.repo.delete(arbitre_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Arbitre not found")

arbitre_service = ArbitreService()
