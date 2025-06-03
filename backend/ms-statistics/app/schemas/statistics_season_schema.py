"""
Esquemas Pydantic para la validación y serialización de estadísticas de temporada.
Incluye modelos base, de creación y actualización para la entidad StatisticSeason.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId
from datetime import datetime

class StatisticSeasonBase(BaseModel):
    """
    Modelo base para una estadística de temporada, utilizado para heredar atributos comunes.
    """
    description: Optional[str] = None
    date_generation: Optional[datetime] = None
    value: Optional[float] = None
    most_fouls: Optional[str] = None
    most_red_cards: Optional[str] = None
    most_yellow_cards: Optional[str] = None
    top_assistant: Optional[str] = None
    top_scorer: Optional[str] = None
    id_season: Optional[str] = None

class StatisticSeasonCreate(StatisticSeasonBase):
    """
    Modelo para la creación de una nueva estadística de temporada.
    Hereda todos los campos de StatisticSeasonBase.
    """
    pass

class StatisticSeasonUpdate(StatisticSeasonBase):
    """
    Modelo para la actualización de una estadística de temporada.
    Hereda todos los campos de StatisticSeasonBase.
    """
    pass

class StatisticSeasonResponse(StatisticSeasonBase):
    """
    Modelo de respuesta para representar una estadística de temporada con su ID.
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

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
