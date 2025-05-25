from django.db import models

class ICatalogComponent:
    """
    Interfaz para componentes de catálogo.
    Define la estructura mínima que deben implementar los catálogos y sus ítems.
    """
    def getName(self):
        """Devuelve el nombre del componente."""
        raise NotImplementedError
    def getCode(self):
        """Devuelve el código único del componente."""
        raise NotImplementedError

class BaseCatalog(models.Model, ICatalogComponent):
    """
    Clase abstracta base para catálogos e ítems.
    Incluye atributos y métodos comunes, así como relaciones jerárquicas.
    """
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    version = models.IntegerField(default=1)
    isActive = models.BooleanField(default=True)
    parent_catalog = models.ForeignKey('self', related_name='child_catalogs', null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        abstract = True

    def listChildCatalogs(self):
        """Devuelve todos los catálogos hijos."""
        return self.child_catalogs.all()
    def findChildByCode(self, code):
        """Busca un catálogo hijo por código."""
        return self.child_catalogs.filter(code=code).first()
    def addChildCatalog(self, child):
        """Agrega un catálogo hijo a este catálogo."""
        child.parent_catalog = self
        child.save()
    def removeChildCatalog(self, code):
        """Elimina un catálogo hijo por código."""
        self.child_catalogs.filter(code=code).delete()
    def getParentCatalog(self):
        """Devuelve el catálogo padre."""
        return self.parent_catalog
    def setParentCatalog(self, parent):
        """Asigna el catálogo padre."""
        self.parent_catalog = parent
        self.save()
    def updateVersion(self):
        """Incrementa la versión del catálogo."""
        self.version += 1
        self.save()
    def getName(self):
        """Devuelve el nombre del catálogo."""
        return self.name
    def getCode(self):
        """Devuelve el código único del catálogo."""
        return self.code

class CatalogCategory(BaseCatalog):
    """
    Modelo para categorías de catálogo.
    Permite jerarquía y agrupación de ítems.
    """
    level = models.IntegerField(default=0)
    def getLevel(self):
        """Devuelve el nivel jerárquico de la categoría."""
        return self.level
    def listCatalogs(self):
        """Lista todos los ítems asociados a la categoría."""
        return self.catalogs.all()
    def countCatalogs(self):
        """Cuenta los ítems asociados a la categoría."""
        return self.catalogs.count()
    def existsCatalogByCode(self, code):
        """Verifica si existe un ítem por código en la categoría."""
        return self.catalogs.filter(code=code).exists()
    def addCatalog(self, item):
        """Agrega un ítem existente a la categoría."""
        item.category = self
        item.save()
    def removeCatalog(self, code):
        """Elimina un ítem de la categoría por código."""
        self.catalogs.filter(code=code).delete()

class CatalogItem(BaseCatalog):
    """
    Modelo para ítems de catálogo.
    Cada ítem pertenece a una categoría y puede tener jerarquía.
    """
    category = models.ForeignKey(CatalogCategory, related_name='catalogs', on_delete=models.CASCADE)
    def getCategory(self):
        """Devuelve la categoría asociada al ítem."""
        return self.category
    def changeCategory(self, newCat):
        """Cambia la categoría del ítem a una nueva categoría."""
        self.category = newCat
        self.save()
    def getPath(self):
        """Devuelve la ruta jerárquica completa del ítem dentro del catálogo."""
        path = [self.getName()]
        cat = self.category
        while cat:
            path.append(cat.getName())
            cat = cat.parent_catalog
        return '/'.join(reversed(path))
