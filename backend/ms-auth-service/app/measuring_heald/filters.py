import django_filters
from .models import MeasuringHealth


class MeasuringHealthFilter(django_filters.FilterSet):
    date_after = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_before = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    
    imc_min = django_filters.NumberFilter(field_name='imc', lookup_expr='gte')
    imc_max = django_filters.NumberFilter(field_name='imc', lookup_expr='lte')
    
    weight_min = django_filters.NumberFilter(field_name='weight', lookup_expr='gte')
    weight_max = django_filters.NumberFilter(field_name='weight', lookup_expr='lte')
    
    blood_pressure_min = django_filters.NumberFilter(field_name='bloodPressure', lookup_expr='gte')
    blood_pressure_max = django_filters.NumberFilter(field_name='bloodPressure', lookup_expr='lte')
    
    class Meta:
        model = MeasuringHealth
        fields = ['date', 'date_after', 'date_before', 
                  'imc_min', 'imc_max', 
                  'weight_min', 'weight_max',
                  'blood_pressure_min', 'blood_pressure_max']