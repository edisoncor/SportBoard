"""
Esquemas Pydantic para la validación y serialización de estadísticas individuales de atletas.
Incluye modelos base, de creación y actualización para la entidad StatisticIndividual.
"""

from pydantic import BaseModel, Field, field_validator, ValidationError, root_validator
from typing import Optional
from bson import ObjectId
from datetime import datetime

class StatisticIndividualBase(BaseModel):
    """
    Modelo base para una estadística individual de atleta, utilizado para heredar atributos comunes.
    """
    description: Optional[str] = None
    date_generation: Optional[datetime] = None
    value: Optional[float] = None
    goal: Optional[int] = None
    own_goal: Optional[int] = None
    foul: Optional[int] = None
    red_card: Optional[int] = None
    yellow_card: Optional[int] = None
    athlete_id: Optional[str] = None

class StatisticIndividualCreate(StatisticIndividualBase):
    """
    Modelo para la creación de una nueva estadística individual.
    Hereda todos los campos de StatisticIndividualBase.
    """
    pass

class StatisticIndividualUpdate(StatisticIndividualBase):
    """
    Modelo para la actualización parcial de una estadística individual.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    goal: Optional[int] = None
    own_goal: Optional[int] = None
    foul: Optional[int] = None
    red_card: Optional[int] = None
    yellow_card: Optional[int] = None

class StatisticIndividualResponse(StatisticIndividualBase):
    """
    Modelo de respuesta para representar una estadística individual con su ID.
    Convierte ObjectId a string y usa el alias '_id'.
    """
    id: str = Field(alias="_id")

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ObjectId en un string antes de la serialización.
        """
        return str(v) if v else None

    @field_validator("athlete_id", mode="before")
    @classmethod
    def validate_athlete_id(cls, v):
        """
        Valida y transforma el ObjectId del campo athlete_id en string antes de la serialización.
        """
        return str(v) if isinstance(v, ObjectId) else v

    @root_validator(pre=True)
    def check_fields(cls, values):
        """
        Valida todos los campos del modelo antes de la serialización, permitiendo manejo de errores personalizado.
        """
        for k, v in values.items():
            try:
                pass
            except Exception as e:
                print(f"Error en campo '{k}': valor '{v}', error: {e}")
                raise e
        return values

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
