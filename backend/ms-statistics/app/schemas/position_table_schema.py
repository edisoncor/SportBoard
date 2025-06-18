"""
Esquemas Pydantic para la validación y serialización de posiciones en tablas de clasificación.
Incluye modelos base, de creación y actualización para la entidad PositionTable.
"""

# app/schemas/position_table_schema.py - VERSIÓN CORREGIDA
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId

# Schemas de posición en tabla CORREGIDOS
class PositionTableBase(BaseModel):
    """
    Modelo base para una posición en la tabla de clasificación, utilizado para heredar atributos comunes.
    """
    position: Optional[int] = None
    points_total: Optional[int] = None
    table_rating_id: Optional[str] = None 
    team_id: Optional[str] = None

class PositionTableCreate(PositionTableBase):
    """
    Modelo para la creación de una nueva posición en la tabla.
    Hereda todos los campos de PositionTableBase.
    """
    pass

class PositionTableUpdate(PositionTableBase):
    """
    Modelo para la actualización parcial de una posición en la tabla.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    position: Optional[int] = None
    points_total: Optional[int] = None
    table_rating_id: Optional[str] = None
    team_id: Optional[str] = None

class PositionTableResponse(PositionTableBase):
    """
    Modelo de respuesta para representar una posición en la tabla con su ID.
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

    @field_validator("table_rating_id", mode="before")
    @classmethod
    def validate_table_rating_id(cls, v):
        """
        Valida y transforma el ObjectId del campo table_rating_id en string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    @field_validator("team_id", mode="before")
    @classmethod
    def validate_team_id(cls, v):
        """
        Valida y transforma el ObjectId del campo team_id en string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }