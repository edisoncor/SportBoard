from django.db import models
from core.models import AuditableModel
from institution.models import Institution


class Administration(AuditableModel):
    """
    Modelo para gestionar datos de administración
    """
    name = models.CharField(max_length=200)
    director = models.CharField(max_length=200, blank=True, null=True)
    mail = models.EmailField(max_length=100, blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    active = models.BooleanField(default=True)
    creationDate = models.DateField(auto_now_add=True)

    # Add Many-to-One relationship with Institution
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True, related_name='administrations')

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ["-creationDate", "name"]
        verbose_name = "Administration"
        verbose_name_plural = "Administrations"