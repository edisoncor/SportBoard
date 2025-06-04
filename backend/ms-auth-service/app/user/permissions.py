from functools import wraps
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from .models import Permission, User


def get_user_permissions(user: User):
    f"""
    Recupera todos los permisos asociados a un usuario a través de sus roles.
    Args:
        user (User): Usuario del cual se obtendrán los permisos.
    Returns:
        list: Lista de nombres de permisos disponibles para el usuario.
    Raises:
        AuthenticationFailed: Si el usuario no está autenticado.
    """
    if user.is_authenticated:
        return list(Permission.objects.filter(
            role__id__in=user.role.values_list("id", flat=True)
        ).values_list("name", flat=True))
    raise AuthenticationFailed


def check_user_has_permissions(user:User, required_perms:list):
    f"""
    Verifica si un usuario tiene los permisos requeridos.
    Args:
        user (User): Usuario a verificar.
        required_perms (list): Lista de nombres de permisos requeridos.
    Returns:
        None
    Raises:
        PermissionDenied: Si el usuario no tiene alguno de los permisos requeridos y no es admin.
    """
    user_permissions = get_user_permissions(user)

    def check_perm(user_perm_list):
        return any(_perm in user_perm_list for _perm in required_perms)

    if user.is_admin is False and required_perms and check_perm(user_permissions) is False:
        raise PermissionDenied


class CustomPermissionMixin:
    f"""
    Mixin personalizado para verificación de permisos en vistas DRF.
    Extiende la comprobación estándar de permisos de DRF agregando validación personalizada
    basada en los permisos asignados al usuario.
    """
    custom_permissions = None

    def check_permissions(self, request):
        f"""
        Verifica si el usuario tiene todos los permisos personalizados requeridos.
        Args:
            request: Objeto request que contiene el usuario.
        Returns:
            El resultado del método check_permissions de la clase padre.
        """
        check_user_has_permissions(request.user, self.get_custom_permissions())
        return super().check_permissions(request)

    def get_custom_permissions(self):
        f"""
        Obtiene los permisos personalizados requeridos para esta vista.
        Returns:
            list: Lista de permisos requeridos.
        """
        return self.custom_permissions
