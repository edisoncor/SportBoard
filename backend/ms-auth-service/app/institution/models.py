from django.db import models
from core.models import AuditableModel


class Catalogue(AuditableModel):
    """
    Modelo para catálogos utilizados en Institution (ciudades y ubicaciones)
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=10, choices=[
        ('COUNTRY', 'País'),
        ('PROVINCE', 'Provincia'),
        ('CITY', 'Ciudad'),
        ('LOCATION', 'Ubicación')
    ])

    code = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.type}"
    
    class Meta:
        ordering = ["name", "type"]


class Institution(AuditableModel):
    """
    Modelo para gestionar instituciones educativas, empresas u organizaciones
    """
    name = models.CharField(max_length=200)
    director = models.CharField(max_length=200, blank=True, null=True)
    direction = models.CharField(max_length=255, blank=True, null=True)
    mail = models.EmailField(max_length=100, blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    active = models.BooleanField(default=True)
    country = models.ForeignKey(
        Catalogue,
        on_delete=models.SET_NULL,
        related_name='country_institutions',
        limit_choices_to={'type': 'COUNTRY'},
        null=True,
        blank=True
    )
    province = models.ForeignKey(
        Catalogue,
        on_delete=models.SET_NULL,
        related_name='province_institutions',
        limit_choices_to={'type': 'PROVINCE'},
        null=True,
        blank=True
    )
    city = models.ForeignKey(
        Catalogue,
        on_delete=models.SET_NULL,
        related_name='city_institutions',
        limit_choices_to={'type': 'CITY'},
        null=True,
        blank=True
    )
    location = models.ForeignKey(
        Catalogue,
        on_delete=models.SET_NULL,
        related_name='location_institutions',
        limit_choices_to={'type': 'LOCATION'},
        null=True,
        blank=True
    )
    creationDate = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ["-creationDate", "name"]
        verbose_name = "Institution"
        verbose_name_plural = "Institutions"