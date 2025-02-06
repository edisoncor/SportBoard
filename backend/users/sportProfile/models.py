from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class Nacionality(models.Model):
    nacionality_name = models.CharField(max_length=20, null=False, unique=True)

    def __str__(self):
        return self.nacionality_name

class Role(models.TextChoices):
    ADMIN = 'ADMIN', 'Administrator'
    USER = 'USER', 'User'
    PLAYER = 'PLAYER', 'Player'
    ARBITER = 'ARBITER', 'Arbiter'
    SUPPORT = 'SUPPORT', 'Support'
    COACH = 'COACH', 'Coach'
    VAR = 'VAR', 'Var'
    
class Status(models.TextChoices):
    ACTIVE = 'ACTIVE', 'Active'
    INACTIVE = 'INACTIVE', 'Inactive'
    INJURED = 'INJURED', 'Injured'
    RETIRED = 'RETIRED', 'Retired'

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    nationality = models.ForeignKey(
        Nacionality,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    birthdate = models.DateField()
    weigth = models.FloatField()
    ##
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.PLAYER
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    objects = UserManager()
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        null=True,
        blank=True
    )
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}" if self.user else "Unassigned Profile"
    
class Player(User):
    team = models.CharField(max_length=100, null=True, blank=True)
    jersey_number = models.IntegerField(null=True, blank=True)
    position = models.CharField(max_length=50, null=True, blank=True)
    player_status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE  # El valor predeterminado es 'ACTIVE'
    )

    class Meta:
        verbose_name = "Player"
        verbose_name_plural = "Players"

    def __str__(self):
        return f"{self.username} - {self.position or 'No Position'}"
