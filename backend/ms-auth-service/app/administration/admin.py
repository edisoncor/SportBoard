from django.contrib import admin
from .models import Administration


@admin.register(Administration)
class AdministrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'director', 'mail', 'active', 'creationDate']
    list_filter = ['active']
    search_fields = ['name', 'director', 'mail']
    date_hierarchy = 'creationDate'