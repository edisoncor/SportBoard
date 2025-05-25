"""
Lógica de negocio para el microservicio de catálogo.
Agrupa funciones y clases que encapsulan las reglas del dominio y operaciones de negocio.
"""
from .models import CatalogCategory, CatalogItem
from django.core.exceptions import ValidationError, ObjectDoesNotExist

class ConflictError(Exception):
    """Excepción para conflictos de negocio (por ejemplo, estado inconsistente)."""
    pass

# --- Operaciones sobre CatalogItem ---
def activate_item(code):
    """Activa un ítem del catálogo por su código."""
    try:
        item = CatalogItem.objects.get(code=code)
        if item.isActive:
            raise ConflictError("El ítem ya está activo.")
        item.isActive = True
        item.save()
        return item
    except CatalogItem.DoesNotExist:
        raise ObjectDoesNotExist("Ítem no encontrado.")

def deactivate_item(code):
    """Desactiva un ítem del catálogo por su código."""
    try:
        item = CatalogItem.objects.get(code=code)
        if not item.isActive:
            raise ConflictError("El ítem ya está inactivo.")
        item.isActive = False
        item.save()
        return item
    except CatalogItem.DoesNotExist:
        raise ObjectDoesNotExist("Ítem no encontrado.")

# --- Operaciones sobre CatalogCategory ---
def add_item_to_category(category_code, item_code):
    """Agrega un ítem existente a una categoría."""
    try:
        category = CatalogCategory.objects.get(code=category_code)
        item = CatalogItem.objects.get(code=item_code)
        category.addCatalog(item)
        return item
    except CatalogCategory.DoesNotExist:
        raise ObjectDoesNotExist("Categoría no encontrada.")
    except CatalogItem.DoesNotExist:
        raise ObjectDoesNotExist("Ítem no encontrado.")

def remove_item_from_category(category_code, item_code):
    """Elimina un ítem de una categoría."""
    try:
        category = CatalogCategory.objects.get(code=category_code)
        category.removeCatalog(item_code)
    except CatalogCategory.DoesNotExist:
        raise ObjectDoesNotExist("Categoría no encontrada.")

# Puedes seguir agrupando aquí más lógica de negocio relevante...
