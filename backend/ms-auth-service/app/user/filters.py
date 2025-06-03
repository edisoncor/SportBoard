import django_filters

from .enums import ROLE_CHOICE
from .models import User


class UserFilter(django_filters.FilterSet):
    """
    Filter set for User model that enables filtering users by verification status.
    
    This filter is used in API views to allow clients to filter users based on
    whether they have verified their accounts.
    """   
    class Meta:
        model = User
        fields = ['verified']