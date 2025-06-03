import django_filters
from .models import Institution, Catalogue


class CatalogueFilter(django_filters.FilterSet):
    type = django_filters.CharFilter(lookup_expr='exact')
    name = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Catalogue
        fields = ['type', 'name']


class InstitutionFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    city = django_filters.NumberFilter(field_name='city__id')
    location = django_filters.NumberFilter(field_name='location__id')
    active = django_filters.BooleanFilter()
    created_after = django_filters.DateFilter(field_name='creationDate', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='creationDate', lookup_expr='lte')
    
    class Meta:
        model = Institution
        fields = ['name', 'city', 'location', 'active', 'created_after', 'created_before']