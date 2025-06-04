from django.db.models.signals import post_save
from django.dispatch import receiver
from user.models import User
from user.enums import SystemRoleEnum

@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    """
    Signal handler that assigns the ESPECTATOR role by default to newly created users if they don't have any role.
    
    This function is triggered after a User instance is saved. If the user is newly created
    and doesn't have any roles assigned, it automatically assigns the ESPECTATOR role.
    
    Args:
        sender: The model class that sent the signal (User).
        instance: The actual instance of the User model that was saved.
        created (bool): A boolean indicating if the user was created (True) or updated (False).
        **kwargs: Additional keyword arguments.
        
    Returns:
        None
    """
    if created and not instance.role.exists():
        from user.models import Role
        # Obtener o crear el rol de espectador
        spectator_role, _ = Role.objects.get_or_create(name=SystemRoleEnum.ESPECTATOR)
        
        # Asignar el rol al usuario si no tiene ninguno
        instance.role.add(spectator_role)
        print(f"Rol ESPECTATOR asignado automáticamente al usuario {instance.email}")
