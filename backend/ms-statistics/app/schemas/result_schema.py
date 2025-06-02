"""
Esquemas Pydantic para la validación y serialización de resultados de partidos.
Incluye modelos base, de creación y actualización para la entidad Result.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId
from datetime import datetime

class ResultBase(BaseModel):
    """
    Modelo base para un resultado de partido, utilizado para heredar atributos comunes.
    """
    date_registration: Optional[datetime] = None
    details: Optional[str] = None
    loser: Optional[str] = None
    score_local: Optional[int] = None
    score_visitor: Optional[int] = None
    winner: Optional[str] = None
    scoreboard_id: Optional[str] = None  # ✅ String en schema

class ResultCreate(ResultBase):
    """
    Modelo para la creación de un nuevo resultado de partido.
    Hereda todos los campos de ResultBase.
    """
    pass

class ResultUpdate(ResultBase):
    """
    Modelo para la actualización parcial de un resultado de partido.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    pass

class ResultResponse(ResultBase):
    """
    Modelo de respuesta para representar un resultado de partido con su ID.
    Convierte ObjectId a string y usa el alias '_id'.
    """
    id: str = Field(alias="_id")  # ✅ Requerido, sin Optional

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ObjectId en un string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    @field_validator("scoreboard_id", mode="before")
    @classmethod
    def validate_scoreboard_id(cls, v):
        """
        Valida y transforma el ObjectId del campo scoreboard_id en string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }