"""
Esquemas Pydantic para la validación y serialización de ítems de catálogo.
Incluye modelos base, de creación, actualización y respuesta para la entidad CatalogItem.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId
from app.utils import PyObjectId

class CatalogItemBase(BaseModel):
    """
    Modelo base para un ítem de catálogo, utilizado para heredar atributos comunes.
    """
    code: str
    description: str
    category: str

class CatalogItemCreate(CatalogItemBase):
    """
    Modelo para la creación de un nuevo ítem de catálogo.
    Hereda todos los campos de CatalogItemBase.
    """
    pass

class CatalogItemUpdate(CatalogItemBase):
    """
    Modelo para la actualización parcial de un ítem de catálogo.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    code: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class CatalogItemResponse(CatalogItemBase):
    """
    Modelo de respuesta para representar un ítem de catálogo con su ID.
    Convierte el ID a string y usa el alias '_id'.
    """
    id: str = Field(alias="_id")

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ID en un string antes de la serialización.
        """
        return str(v) if v else None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
