from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'
    verbose_name = _('user')

    def ready(self):
        import user.signals
        # Import function here to avoid circular imports
        from user.utils import create_default_roles
        try:
            create_default_roles()
        except Exception as e:
            # Manejo de error - por ejemplo, cuando la base de datos aún no está disponible
            print(f"No se pudieron crear roles por defecto: {e}")