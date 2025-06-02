# Modelo de árbitro

from beanie import Document
from pydantic import Field
from typing import Optional

class Arbitre(Document):
    """
    Modelo que representa a un árbitro en el sistema de estadísticas deportivas.

    Atributos:
        name (str): Nombre completo del árbitro.
        license_number (Optional[str]): Número de licencia del árbitro (opcional).
    """

    name: str
    license_number: Optional[str] = None

    class Settings:
        """
        Configuración de la colección en MongoDB para el modelo Arbitre.
        """
        name = "arbitres"

    model_config = {
        "arbitrary_types_allowed": True,
    }