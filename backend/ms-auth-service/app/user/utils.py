from datetime import datetime, timezone
from typing import Any, Dict

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.crypto import get_random_string
from rest_framework import permissions

from .enums import SystemRoleEnum
from .models import Token, User


def send_email(subject:str, email_to: str, html_alternative: Any, attachment: Dict = None):
    f"""
    Envía un correo electrónico con contenido HTML.
    
    Args:
        subject (str): Asunto del correo.
        email_to (str): Dirección de correo del destinatario.
        html_alternative (Any): Contenido HTML del correo.
        attachment (Dict, opcional): Información del adjunto. Por defecto None.
        
    Returns:
        None
    """
    msg = EmailMultiAlternatives(
        subject=subject, from_email=settings.EMAIL_FROM,to= [email_to]
    )
    msg.attach_alternative(html_alternative, "text/html")
    msg.send(fail_silently=False)


def create_token_and_send_user_email(user: User, token_type: str)->None:
    """
    Crea un token para un usuario y envía un correo para verificación de cuenta o reseteo de contraseña.
    
    Args:
        user (User): Usuario para el que se crea el token.
        token_type (str): Tipo de token a crear (ACCOUNT_VERIFICATION o PASSWORD_RESET).
        
    Returns:
        None
    """
    from .tasks import send_user_creation_email
    token, _ = Token.objects.update_or_create(
        user=user,
        token_type=token_type,
        defaults={
            "user": user,
            "token_type": token_type,
            "token": get_random_string(120),
            "created_at": datetime.now(timezone.utc)
        },
    )
    user_data = {
        "email": user.email,
        "fullname": f"{user.firstname}",
        "token": token.token
    }
    send_user_creation_email.delay(user_data)


def get_user_role_names(user:User)->list:
    """
    Retorna una lista de nombres de roles para el usuario dado.
    
    Args:
        user (User): Usuario del cual obtener los roles.
        
    Returns:
        list: Lista de nombres de roles asociados al usuario.
    """
    return list(user.role.all().values_list('name', flat=True))

def is_admin_user(user:User)->bool:
    """
    Verifica si un usuario autenticado es admin o no.
    
    Args:
        user (User): Usuario a verificar.
        
    Returns:
        bool: True si el usuario es admin, False en caso contrario.
    """
    return user.is_admin or user.role.filter(name=SystemRoleEnum.SUPERADMIN).exists()


class IsAdmin(permissions.BasePermission):
    """
    Clase de permiso que permite acceso solo a usuarios Admin.
    """
    message = "Only Admins are authorized to perform this action."
    
    def has_permission(self, request, view):
        """
        Verifica si el usuario tiene permiso para acceder a la vista.
        
        Args:
            request: Objeto request.
            view: Vista a la que se accede.
            
        Returns:
            bool: True si el usuario está autenticado y es admin, False en caso contrario.
        """
        if not request.user.is_authenticated:
            return False
        return is_admin_user(request.user)
    
def create_default_roles():
    """
    Crea roles por defecto con permisos predefinidos.
    Puede llamarse durante la inicialización de la app o desde la interfaz de administración.
    
    La función crea los roles del sistema definidos en SystemRoleEnum y asigna
    los permisos apropiados a cada rol según sus responsabilidades.
    
    Returns:
        None
    """
    from user.models import Role, Permission
    from user.enums import SystemRoleEnum
    import logging
    
    logger = logging.getLogger(__name__)
    
    # Define default roles with their permissions according to system enums
    default_roles = {
        SystemRoleEnum.SUPERADMIN: [
            # SUPERADMIN has all permissions
            'ViewTransaction', 'GenerateReport',
            'ViewInstitution', 'CreateInstitution', 'UpdateInstitution', 'DeleteInstitution',
            'ViewAdministration', 'CreateAdministration', 'UpdateAdministration', 'DeleteAdministration',
            'ViewDepartment', 'CreateDepartment', 'UpdateDepartment', 'DeleteDepartment',
            'ViewHealth', 'CreateHealth', 'UpdateHealth', 'DeleteHealth',
            'ViewPerformance', 'CreatePerformance', 'UpdatePerformance', 'DeletePerformance',
            'ViewSportProfile', 'CreateSportProfile', 'UpdateSportProfile', 'DeleteSportProfile',
            # User CRUD permissions
            'ViewUser', 'CreateUser', 'UpdateUser', 'DeleteUser',
        ],
        SystemRoleEnum.ADMIN: [
            # ADMIN has most permissions except deleting critical resources
            'ViewTransaction', 'GenerateReport',
            'ViewInstitution', 'CreateInstitution', 'UpdateInstitution',
            'ViewAdministration', 'CreateAdministration', 'UpdateAdministration',
            'ViewDepartment', 'CreateDepartment', 'UpdateDepartment',
            'ViewHealth', 'CreateHealth', 'UpdateHealth',
            'ViewPerformance', 'CreatePerformance', 'UpdatePerformance',
            'ViewSportProfile', 'CreateSportProfile', 'UpdateSportProfile',
            # User CRUD permissions (except delete)
            'ViewUser', 'CreateUser', 'UpdateUser',
        ],
        SystemRoleEnum.COORDINATOR: [
            # COORDINATOR manages athletic activities
            'ViewInstitution',
            'ViewAdministration',
            'ViewDepartment',
            'ViewHealth', 'CreateHealth', 'UpdateHealth',
            'ViewPerformance', 'CreatePerformance', 'UpdatePerformance',
            'ViewSportProfile', 'CreateSportProfile', 'UpdateSportProfile',
            # Limited user management
            'ViewUser', 'UpdateUser',
        ],
        SystemRoleEnum.COACH: [
            # COACH manages athletes and their performance
            'ViewHealth',
            'ViewPerformance', 'CreatePerformance', 'UpdatePerformance',
            'ViewSportProfile', 'UpdateSportProfile',
            # Limited user view
            'ViewUser',
        ],
        SystemRoleEnum.ATHLETE: [
            # ATHLETE has limited view permissions
            'ViewHealth',
            'ViewPerformance',
            'ViewSportProfile',
            # Can view user profiles
            'ViewUser',
        ],
        SystemRoleEnum.ESPECTATOR: [
            # ESPECTATOR has minimal permissions
            'ViewSportProfile',
        ],
        SystemRoleEnum.REEFEREE: [
            # REFEREE has permissions related to performance
            'ViewPerformance', 'CreatePerformance', 'UpdatePerformance',
            'ViewSportProfile',
            'ViewUser',
        ],
    }

    for role_name, permission_names in default_roles.items():
        role, created = Role.objects.get_or_create(name=role_name)
        
        # Get Permission objects by name
        permissions = Permission.objects.filter(name__in=permission_names)
        
        # Clear existing permissions and set new ones
        role.permissions.clear()
        role.permissions.add(*permissions)
        
        # Log results
        logger.info(f"{'Created' if created else 'Updated'} role: {role_name}")

        # Check for missing permissions
        missing_permissions = set(permission_names) - set(permissions.values_list('name', flat=True))
        if missing_permissions:
            logger.warning(f"Missing permissions for {role_name}: {', '.join(missing_permissions)}")
