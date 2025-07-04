"""
Servicio para la gestión de ítems de catálogo en el sistema de estadísticas deportivas.

Proporciona métodos para crear, listar, obtener y eliminar ítems de catálogo utilizando el repositorio correspondiente.
"""

from app.repositories.catalog_item_repository import CatalogItemRepository
from app.schemas.catalog_item_schema import CatalogItemSchema
from beanie import PydanticObjectId
from fastapi import HTTPException

class CatalogItemService:
    """
    Servicio que encapsula la lógica de negocio para la gestión de ítems de catálogo.
    """
    def __init__(self):
        """
        Inicializa el servicio con una instancia del repositorio de ítems de catálogo.
        """
        self.repo = CatalogItemRepository()

    async def create_catalog_item(self, item: CatalogItemSchema) -> CatalogItemSchema:
        """
        Crea un nuevo ítem de catálogo en la base de datos.

        Args:
            item (CatalogItemSchema): Datos del ítem a crear.
        Returns:
            CatalogItemSchema: Ítem de catálogo creado.
        """
        doc = await self.repo.create(item.dict())
        return CatalogItemSchema(**doc.dict())

    async def list_catalog_items(self) -> list[CatalogItemSchema]:
        """
        Obtiene la lista de todos los ítems de catálogo registrados.

        Returns:
            list[CatalogItemSchema]: Lista de ítems de catálogo.
        """
        items = await self.repo.list()
        return [CatalogItemSchema(**i.dict()) for i in items]

    async def get_catalog_item(self, item_id: PydanticObjectId) -> CatalogItemSchema:
        """
        Obtiene un ítem de catálogo por su ID.

        Args:
            item_id (PydanticObjectId): ID del ítem de catálogo.
        Returns:
            CatalogItemSchema: Ítem de catálogo encontrado.
        Raises:
            HTTPException: Si el ítem no existe.
        """
        item = await self.repo.get_by_id(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="CatalogItem not found")
        return CatalogItemSchema(**item.dict())

    async def delete_catalog_item(self, item_id: PydanticObjectId) -> None:
        """
        Elimina un ítem de catálogo por su ID.

        Args:
            item_id (PydanticObjectId): ID del ítem de catálogo a eliminar.
        Raises:
            HTTPException: Si el ítem no existe.
        """
        deleted = await self.repo.delete(item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="CatalogItem not found")

catalog_item_service = CatalogItemService()
