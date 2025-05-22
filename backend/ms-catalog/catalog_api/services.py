"""
Servicios de lógica de negocio para el microservicio de catálogo.
"""
from .models import CatalogCategory, CatalogItem
from django.core.exceptions import ValidationError

def create_category(data):
    """Crea una nueva categoría de catálogo."""
    return CatalogCategory.objects.create(**data)

def create_item(data):
    """Crea un nuevo item de catálogo."""
    return CatalogItem.objects.create(**data)

def activate_item(code):
    """Activa un item por su código."""
    item = CatalogItem.objects.filter(code=code).first()
    if not item:
        raise ValidationError('Item no encontrado')
    item.is_active = True
    item.save()
    return item

def deactivate_item(code):
    """Desactiva un item por su código."""
    item = CatalogItem.objects.filter(code=code).first()
    if not item:
        raise ValidationError('Item no encontrado')
    item.is_active = False
    item.save()
    return item
