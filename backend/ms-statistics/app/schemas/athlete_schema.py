"""
Esquemas Pydantic para la validación y serialización de datos relacionados con atletas.
Incluye modelos base, de creación, actualización y respuesta para la entidad Athlete.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId


class AthleteBase(BaseModel):
    """
    Modelo base para un atleta, utilizado para heredar atributos comunes.
    """
    name: str
    position: Optional[str] = None
    team_id: Optional[str] = None

class AthleteCreate(AthleteBase):
    """
    Modelo para la creación de un nuevo atleta.
    Hereda todos los campos de AthleteBase.
    """
    pass

class AthleteUpdate(AthleteBase):
    """
    Modelo para la actualización parcial de un atleta.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    name: Optional[str] = None
    position: Optional[str] = None
    team_id: Optional[str] = None

class AthleteResponse(AthleteBase):
    """
    Modelo de respuesta para representar un atleta con su ID.
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
