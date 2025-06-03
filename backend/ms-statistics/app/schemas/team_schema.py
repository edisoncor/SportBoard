"""
Esquemas Pydantic para la validación y serialización de datos de equipos.
Incluye modelos base, de creación, actualización y respuesta para la entidad Team.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from bson import ObjectId

class TeamBase(BaseModel):
    """
    Modelo base para un equipo, utilizado para heredar atributos comunes.
    """
    name: str
    description: Optional[str] = None
    founded: Optional[int] = None

class TeamCreate(TeamBase):
    """
    Modelo para la creación de un nuevo equipo.
    Hereda todos los campos de TeamBase.
    """
    pass

class TeamUpdate(TeamBase):
    """
    Modelo para la actualización parcial de un equipo.
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    name: Optional[str] = None  
    description: Optional[str] = None
    founded: Optional[int] = None

class TeamResponse(TeamBase):
    """
    Modelo de respuesta para representar un equipo con su ID y lista de atletas.
    Convierte ObjectId a string y usa el alias '_id'.
    """
    id: str = Field(alias="_id") 
    athletes: List[str] = Field(default_factory=list)

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v):
        """
        Valida y transforma el ObjectId en un string antes de la serialización.
        """
        if isinstance(v, ObjectId):
            return str(v)
        return str(v) if v else None

    @field_validator("athletes", mode="before")
    @classmethod
    def validate_athletes(cls, v):
        """
        Valida y transforma los ObjectId de la lista athletes en strings antes de la serialización.
        """
        if isinstance(v, list):
            return [str(item) if isinstance(item, ObjectId) else str(item) for item in v]
        return []

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }