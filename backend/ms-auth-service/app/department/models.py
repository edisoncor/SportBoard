from django.db import models
from core.models import AuditableModel
from administration.models import Administration


class Department(AuditableModel):
    """
    Modelo para gestionar departamentos o áreas organizativas
    """
    name = models.CharField(max_length=200)
    director = models.CharField(max_length=200, blank=True, null=True)
    mail = models.EmailField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    active = models.BooleanField(default=True)
    creationDate = models.DateField(auto_now_add=True)

    administration = models.ForeignKey(Administration, on_delete=models.SET_NULL, null=True, blank=True, related_name='departments')

    def __str__(self):
        return self.name
    
    def isActive(self):
        """
        Método que verifica si el departamento está activo
        """
        return self.active
    
    class Meta:
        ordering = ["-creationDate", "name"]
        verbose_name = "Department"
        verbose_name_plural = "Departments"