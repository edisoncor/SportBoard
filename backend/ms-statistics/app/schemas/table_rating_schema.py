"""
Esquemas Pydantic para la validación y serialización de tablas de calificación.
Incluye modelos base, de creación, actualización y respuesta para la entidad TableRating.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from bson import ObjectId

class TableRatingBase(BaseModel):
    """
    Modelo base para una tabla de calificación, utilizado para heredar atributos comunes.
    """
    last_update: Optional[str] = None
    competition_id: Optional[str] = None 
    positions: List[str] = Field(default_factory=list) 

class TableRatingCreate(TableRatingBase):
    """
    Modelo para la creación de una nueva tabla de calificación.
    Hereda todos los campos de TableRatingBase.
    """
    pass

class TableRatingUpdate(TableRatingBase):
    """
    Modelo para la actualización parcial de una tabla de calificación.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    last_update: Optional[str] = None
    competition_id: Optional[str] = None
    positions: Optional[List[str]] = None

class TableRatingResponse(TableRatingBase):
    """
    Modelo de respuesta para representar una tabla de calificación con su ID.
    Convierte ObjectId a string y usa el alias '_id'.
    """
    id: str = Field(alias="_id")  

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ObjectId en un string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    @field_validator("competition_id", mode="before")
    @classmethod
    def validate_competition_id(cls, v):
        """
        Valida y transforma el ObjectId del campo competition_id en string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    @field_validator("positions", mode="before")
    @classmethod
    def validate_positions(cls, v):
        """
        Valida y transforma los ObjectId de la lista positions en strings antes de la serialización.
        """
        if isinstance(v, list):
            return [str(item) if isinstance(item, ObjectId) else str(item) for item in v]
        return []

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }