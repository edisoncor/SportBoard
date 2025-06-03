
from django.contrib import admin

from .models import Role, Token, User, Permission

"""
Admin configuration for the user app.

This module registers the app's models with the Django admin site,
making them accessible through the admin interface.
"""

# Register your models here.
admin.site.register(Role)
admin.site.register(User)
admin.site.register(Token)
admin.site.register(Permission)

