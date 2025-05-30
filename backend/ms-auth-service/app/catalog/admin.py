from django.contrib import admin
from .models import CatalogCategory, CatalogItem

@admin.register(CatalogCategory)
class CatalogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'level', 'isActive', 'version')
    list_filter = ('isActive', 'level')
    search_fields = ('name', 'code')
    ordering = ('level', 'name')

@admin.register(CatalogItem)
class CatalogItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'isActive', 'version')
    list_filter = ('isActive', 'category')
    search_fields = ('name', 'code')
    ordering = ('category', 'name')
