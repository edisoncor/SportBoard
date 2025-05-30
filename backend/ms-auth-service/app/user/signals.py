from django.db.models.signals import post_save
from django.dispatch import receiver
from user.models import User
from user.enums import SystemRoleEnum

@receiver(post_save, sender=User)
def assign_default_role(sender, instance, created, **kwargs):
    """
    Asigna el rol de ESPECTATOR por defecto a usuarios recién creados si no tienen ningún rol.
    """
    if created and not instance.role:
        from user.models import Role
        # Obtener o crear el rol de espectador
        spectator_role, _ = Role.objects.get_or_create(name=SystemRoleEnum.ESPECTATOR)
        
        # Asignar el rol al usuario si no tiene ninguno
        instance.role = spectator_role
        instance.save(update_fields=['role'])
        print(f"Rol ESPECTATOR asignado automáticamente al usuario {instance.email}")
