import django_filters
from .models import Administration


class AdministrationFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    active = django_filters.BooleanFilter()
    created_after = django_filters.DateFilter(field_name='creationDate', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='creationDate', lookup_expr='lte')
    
    class Meta:
        model = Administration
        fields = ['name', 'active', 'created_after', 'created_before']