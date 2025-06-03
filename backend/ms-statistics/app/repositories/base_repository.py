"""
Repositorio base genérico para operaciones CRUD sobre modelos Beanie.
Proporciona métodos asíncronos para obtener, crear, actualizar, eliminar y listar documentos.
"""

from typing import Type, TypeVar, List, Optional, Dict, Any
from beanie import Document, PydanticObjectId

T = TypeVar('T', bound=Document)

class BaseRepository:
    """
    Clase base para repositorios, provee operaciones CRUD genéricas sobre modelos Beanie.
    """
    def __init__(self, model: Type[T]):
        """
        Inicializa el repositorio con el modelo Beanie correspondiente.
        :param model: Clase del modelo Beanie.
        """
        self.model = model

    async def get_by_id(self, id: PydanticObjectId) -> Optional[T]:
        """
        Obtiene un documento por su ID.
        :param id: ID del documento.
        :return: Instancia del modelo o None si no existe.
        """
        return await self.model.get(id)

    async def create(self, data: Dict[str, Any]) -> T:
        """
        Crea un nuevo documento con los datos proporcionados.
        :param data: Diccionario con los datos del documento.
        :return: Instancia creada del modelo.
        """
        doc = self.model(**data)
        await doc.insert()
        return doc

    async def update(self, id: PydanticObjectId, data: Dict[str, Any]) -> Optional[T]:
        """
        Actualiza un documento existente por su ID.
        :param id: ID del documento.
        :param data: Diccionario con los datos a actualizar.
        :return: Instancia actualizada o None si no existe.
        """
        doc = await self.model.get(id)
        if not doc:
            return None
        await doc.set(data)
        return doc

    async def delete(self, id: PydanticObjectId) -> bool:
        """
        Elimina un documento por su ID.
        :param id: ID del documento.
        :return: True si se eliminó, False si no existe.
        """
        doc = await self.model.get(id)
        if not doc:
            return False
        await doc.delete()
        return True

    async def list(self, skip: int = 0, limit: int = 100) -> List[T]:
        """
        Lista documentos del modelo con paginación.
        :param skip: Número de documentos a omitir.
        :param limit: Límite de documentos a retornar.
        :return: Lista de instancias del modelo.
        """
        return await self.model.find_all().skip(skip).limit(limit).to_list()

    async def find_one(self, filter: dict) -> Optional[T]:
        """
        Busca un documento que cumpla con el filtro especificado.
        :param filter: Diccionario de condiciones de búsqueda.
        :return: Instancia encontrada o None si no existe.
        """
        return await self.model.find_one(filter)
