# Modelo de competencia

from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class Competition(Document):
    name: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    id_team: List[ObjectId] = Field(default_factory=list)  # Nuevo campo para equipos

    class Settings:
        name = "competitions"

    model_config = {
        "arbitrary_types_allowed": True,
    }

    def add_team(self, team_id: ObjectId):
        """
        Agrega un equipo al arreglo id_team si no está presente.
        """
        if team_id not in self.id_team:
            self.id_team.append(team_id)
