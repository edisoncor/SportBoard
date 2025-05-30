from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'
    verbose_name = _('user')

    def ready(self):
        import user.signals
        # Import function here to avoid circular imports
        from django.db import connection
        
        try:
            # Check if tables exist before trying to create default roles
            with connection.cursor() as cursor:
                table_names = connection.introspection.table_names(cursor)
                if 'user_role' in table_names:
                    from user.utils import create_default_roles
                    create_default_roles()
        except Exception as e:
            # Manejo de error - por ejemplo, cuando la base de datos aún no está disponible
            print(f"No se pudieron crear roles por defecto: {e}")
