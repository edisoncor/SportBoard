from django.contrib import admin
from .models import Performance


@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = ['date', 'user', 'measure', 'type', 'value']
    list_filter = ['date', 'type', 'measure']
    search_fields = ['user__email', 'user__name', 'type', 'measure']
    date_hierarchy = 'date'