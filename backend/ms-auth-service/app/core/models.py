# Importa el módulo uuid para la generación de identificadores únicos universales (UUID).
import uuid
# Importa models de django.db para definir modelos de base de datos.
from django.db import models

# Modelo abstracto base que proporciona campos de auditoría para otros modelos.
class AuditableModel(models.Model):
    """
    Abstract base model that provides audit fields.

    Este modelo sirve como base para otros modelos en la aplicación,
    proporcionando campos comunes para el seguimiento de la creación y modificación,
    así como una clave primaria UUID.
    
    Atributos:
        id (UUIDField): Clave primaria del modelo, generada automáticamente como UUID.
        created_at (DateTimeField): Marca de tiempo de creación, establecida automáticamente.
        updated_at (DateTimeField): Marca de tiempo de última actualización, establecida automáticamente.
    """
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)  # Identificador único universal como clave primaria.
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación del registro.
    updated_at = models.DateTimeField(auto_now=True)  # Fecha de última actualización del registro.

    class Meta:
        abstract = True  # Indica que este modelo es abstracto y no se creará una tabla para él.