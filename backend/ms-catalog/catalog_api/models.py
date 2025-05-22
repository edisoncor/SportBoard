"""
Modelos del dominio de catálogo, generados a partir del diagrama UML proporcionado.
Incluye relaciones jerárquicas y atributos clave.
"""
from django.db import models

class ICatalogComponent:
    """
    Interfaz para componentes de catálogo.
    """
    def getName(self):
        raise NotImplementedError
    def getCode(self):
        raise NotImplementedError

class BaseCatalog(models.Model, ICatalogComponent):
    """
    Clase abstracta base para catálogos jerárquicos.
    """
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    version = models.IntegerField(default=1)
    parentCatalog = models.ForeignKey('self', null=True, blank=True, related_name='childCatalogs', on_delete=models.SET_NULL)

    class Meta:
        abstract = True

    def getName(self):
        return self.name
    def getCode(self):
        return self.code
    def listChildCatalogs(self):
        return self.childCatalogs.all()
    def findChildByCode(self, code):
        return self.childCatalogs.filter(code=code).first()
    def addChildCatalog(self, child):
        child.parentCatalog = self
        child.save()
    def removeChildCatalog(self, code):
        self.childCatalogs.filter(code=code).delete()
    def getParentCatalog(self):
        return self.parentCatalog
    def setParentCatalog(self, parent):
        self.parentCatalog = parent
        self.save()
    def updateVersion(self):
        self.version += 1
        self.save()

class CatalogCategory(BaseCatalog):
    """
    Categoría de catálogo, puede contener múltiples items.
    """
    level = models.IntegerField(default=0)

    def getLevel(self):
        return self.level
    def listCatalogs(self):
        return self.catalogs.all()
    def countCatalogs(self):
        return self.catalogs.count()
    def existsCatalogByCode(self, code):
        return self.catalogs.filter(code=code).exists()
    def addCatalog(self, item):
        item.category = self
        item.save()
    def removeCatalog(self, code):
        self.catalogs.filter(code=code).delete()

class CatalogItem(models.Model):
    """
    Item de catálogo, asociado a una categoría.
    """
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    version = models.IntegerField(default=1)
    category = models.ForeignKey(CatalogCategory, related_name='catalogs', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def getCategory(self):
        return self.category
    def changeCategory(self, newCat):
        self.category = newCat
        self.save()
    def getPath(self):
        return f"{self.category.code}/{self.code}"
    def isActive(self):
        return self.is_active
