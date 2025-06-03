from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

from .enums import TokenEnum, SystemRoleEnum


class CustomUserManager(BaseUserManager):
    
    """
    Custom user model manager where username is the unique identifiers
    """

    def create_user(self, email, password, **extra_fields):
        from .models import Role
        """
        Create and save a User with the given username and password.
        
        Args:
            email (str): The user's email address, used as the unique identifier.
            password (str): The password for the user.
            **extra_fields: Additional fields to be set on the user.
            
        Returns:
            User: The created user instance.
            
        Raises:
            ValueError: If email is not provided.
        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        # No asignar rol automáticamente en create_user normal
        return user
    
    
    def create_superuser(self, email, password, **extra_fields):
        from .models import Role
        """
        Create and save a SuperUser with the given email and password.
        
        Args:
            email (str): The superuser's email address.
            password (str): The password for the superuser.
            **extra_fields: Additional fields to be set on the superuser.
            
        Returns:
            User: The created superuser instance.
            
        Raises:
            ValueError: If is_staff or is_superuser is not True.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("verified", True)
        extra_fields.setdefault("is_admin", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        
        user = self.create_user(email, password, **extra_fields)
        
        # Asignar rol SUPERADMIN
        try:
            superadmin_role = Role.objects.get(name=SystemRoleEnum.SUPERADMIN)
            user.role.add(superadmin_role)
        except Role.DoesNotExist:
            print(f"WARNING: Role {SystemRoleEnum.SUPERADMIN} does not exist. Creating superuser without role.")
        
        return user

    def create_app_user(self, email, **extra_fields):
        from .utils import create_token_and_send_user_email
        """
        Create a new application user and send verification email.
        
        Args:
            email (str): The user's email address.
            **extra_fields: Additional fields to be set on the user, including optional 'role'.
            
        Returns:
            User: The created user instance.
            
        Raises:
            ValueError: If email is not provided.
        """
        roles = extra_fields.pop('role', None)
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email,  **extra_fields)
        user.save()
        
        # Asignar roles si se proporcionan
        if roles is not None:
            user.role.set(roles)
            
        create_token_and_send_user_email(user, token_type = TokenEnum.ACCOUNT_VERIFICATION)
        return user
