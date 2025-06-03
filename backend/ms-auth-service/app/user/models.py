import uuid
from datetime import datetime, timezone

from core.models import AuditableModel
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from .enums import TOKEN_TYPE_CHOICE
from .managers import CustomUserManager
from institution.models import Institution
from administration.models import Administration
from department.models import Department


class Permission(AuditableModel):
    f"""
    Modelo que representa los permisos que pueden ser asignados a roles.
    """
    name = models.CharField(max_length=250)

    def __str__(self):
        f"""
        Retorna una representación en string del permiso.
        Returns:
            str: El nombre del permiso.
        """
        return f"{self.name}"

    class Meta:
        ordering = ("name",)


class Role(AuditableModel):
    f"""
    Modelo que representa los roles de usuario con los permisos asociados.
    """
    name = models.CharField(max_length=100, unique=True)
    permissions = models.ManyToManyField(Permission)

    def __str__(self):
        f"""
        Retorna una representación en string del rol.
        Returns:
            str: El nombre del rol.
        """
        return f"{self.name}"


class User(AbstractBaseUser, PermissionsMixin):
    f"""
    Modelo personalizado de usuario que soporta el uso de email en vez de username.
    Incluye campos adicionales para información de perfil y permisos basados en roles.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        _("email address"), null=True, blank=True, unique=True)
    # locations = models.ManyToManyField(
    #     "institution.Catalogue",
    #     related_name="users",
    #     blank=True,
    #     limit_choices_to={"type": "LOCATION"},
    #     null=True
    # )
    dni = models.CharField(max_length=20, unique=True, null=True, blank=True)
    password = models.CharField(max_length=255, null=True)
    firstname = models.CharField(max_length=255, blank=True, null=True)
    lastname = models.CharField(max_length=255, blank=True, null=True)
    image = models.FileField(upload_to="users/", blank=True, null=True)
    phone_number = models.CharField(max_length=17, blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified = models.BooleanField(default=False)
    
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    # ManyToManyField for roles (named 'role' but allows multiple roles)
    role = models.ManyToManyField(Role, blank=True, related_name='users')

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        ordering = ("-created_at",) 
        
    def __str__(self) -> str:
        f"""
        Retorna una representación en string del usuario.
        Returns:
            str: El nombre completo y email si existen firstname y lastname, de lo contrario solo el email.
        """
        if self.firstname and self.lastname:
            return f"{self.firstname} {self.lastname} - {self.email}"
        else:
            return self.email

    def save_last_login(self) -> None:
        f"""
        Actualiza el campo last_login del usuario con la fecha y hora actual y guarda el usuario.
        Returns:
            None
        """
        self.last_login = datetime.now()
        self.save()
    
    def permission_list(self):
        f"""
        Recupera la lista de permisos asignados al usuario a través de sus roles.
        Returns:
            list: Lista de nombres de permisos a los que el usuario tiene acceso.
        """
        from user.permissions import get_user_permissions
        return get_user_permissions(self)


class Token(models.Model):
    f"""
    Modelo que representa los tokens de autenticación para verificación de usuario y reseteo de contraseña.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    token = models.CharField(max_length=255, null=True)
    token_type = models.CharField(max_length=100, choices=TOKEN_TYPE_CHOICE)
    
    created_at = models.DateTimeField(auto_now_add=True)    
    def __str__(self):
        f"""
        Retorna una representación en string del token.
        Returns:
            str: String con el usuario y el token.
        """
        return f"{str(self.user)} {self.token}"

    def is_valid(self) -> bool:
        f"""
        Verifica si el token sigue siendo válido según su tiempo de creación y la vida útil configurada.
        Returns:
            bool: True si el token es válido, False en caso contrario.
        """
        lifespan_in_seconds = float(settings.TOKEN_LIFESPAN * 60 * 60)
        now = datetime.now(timezone.utc)
        time_diff = now - self.created_at
        time_diff = time_diff.total_seconds()
        if time_diff >= lifespan_in_seconds:
            return False
        return True

    def verify_user(self) -> None:
        f"""
        Marca al usuario asociado como verificado y activo.
        Returns:
            None
        """
        self.user.verified = True
        self.user.is_active = True
        self.user.save(update_fields=["verified", "is_active"])

    def reset_user_password(self, password: str) -> None:
        f"""
        Restablece la contraseña del usuario asociado.
        Args:
            password (str): Nueva contraseña a establecer para el usuario.
        Returns:
            None
        """
        self.user.set_password(password)
        self.user.save()
