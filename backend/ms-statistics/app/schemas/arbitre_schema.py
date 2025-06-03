"""
Esquemas Pydantic para la validación y serialización de datos de árbitros.
Incluye modelos base, de creación, actualización y respuesta para la entidad Arbitre.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional

class ArbitreBase(BaseModel):
    """
    Modelo base para un árbitro, utilizado para heredar atributos comunes.
    """
    name: str
    license_number: Optional[str] = None

class ArbitreCreate(ArbitreBase):
    """
    Modelo para la creación de un nuevo árbitro.
    Hereda todos los campos de ArbitreBase.
    """
    pass

class ArbitreUpdate(ArbitreBase):
    """
    Modelo para la actualización parcial de un árbitro.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    name: Optional[str] = None
    license_number: Optional[str] = None

class ArbitreResponse(ArbitreBase):
    """
    Modelo de respuesta para representar un árbitro con su ID.
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
