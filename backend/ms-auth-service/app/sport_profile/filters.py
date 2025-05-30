import django_filters
from .models import SportProfile


class SportProfileFilter(django_filters.FilterSet):
    discipline = django_filters.CharFilter(lookup_expr='icontains')
    min_competence = django_filters.NumberFilter(field_name='numCompetence', lookup_expr='gte')
    max_competence = django_filters.NumberFilter(field_name='numCompetence', lookup_expr='lte')
    
    class Meta:
        model = SportProfile
        fields = ['discipline', 'min_competence', 'max_competence', 'user']