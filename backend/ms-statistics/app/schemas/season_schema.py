"""
Esquemas Pydantic para la validación y serialización de datos de temporadas.
Incluye modelos base, de creación y actualización para la entidad Season.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId
from .catalog_item_schema import PyObjectId
from datetime import datetime

# Schemas de temporada

class SeasonBase(BaseModel):
    """
    Modelo base para una temporada, utilizado para heredar atributos comunes.
    """
    name: str
    description: str
    startDate: datetime
    endDate: datetime

class SeasonCreate(SeasonBase):
    """
    Modelo para la creación de una nueva temporada.
    Hereda todos los campos de SeasonBase.
    """
    pass

class SeasonUpdate(SeasonBase):
    """
    Modelo para la actualización de una temporada.
    Hereda todos los campos de SeasonBase.
    """
    pass

class SeasonResponse(SeasonBase):
    """
    Modelo de respuesta para representar una temporada con su ID.
    Convierte ObjectId o PyObjectId a string y usa el alias '_id'.
    """
    id: Optional[str] = Field(None, alias="_id")

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ObjectId o PyObjectId en un string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, PyObjectId):
            return str(v)
        return v

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str, PyObjectId: str},
    }
