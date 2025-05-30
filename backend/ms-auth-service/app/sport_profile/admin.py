from django.contrib import admin
from .models import SportProfile


@admin.register(SportProfile)
class SportProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'discipline', 'numCompetence']
    list_filter = ['discipline']
    search_fields = ['user__email', 'user__name', 'discipline']
    readonly_fields = ['disciplines', 'history']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields
        return []  # Allow all fields when creating a new object