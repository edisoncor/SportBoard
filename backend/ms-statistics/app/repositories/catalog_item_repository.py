from .base_repository import BaseRepository
from app.models.catalog_item import CatalogItem

"""
Repositorio para la entidad CatalogItem. Hereda operaciones CRUD del repositorio base.
"""

class CatalogItemRepository(BaseRepository):
    """
    Repositorio específico para la entidad CatalogItem.
    """
    def __init__(self):
        """
        Inicializa el repositorio con el modelo CatalogItem.
        """
        super().__init__(CatalogItem)
