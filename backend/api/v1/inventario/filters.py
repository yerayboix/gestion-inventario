import django_filters
from inventario.models import Libro

class LibroFilter(django_filters.FilterSet):
    titulo = django_filters.CharFilter(lookup_expr='icontains')
    pvp_min = django_filters.NumberFilter(field_name='pvp', lookup_expr='gte')
    pvp_max = django_filters.NumberFilter(field_name='pvp', lookup_expr='lte')
    precio_min = django_filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max = django_filters.NumberFilter(field_name='precio', lookup_expr='lte')
    cantidad_min = django_filters.NumberFilter(field_name='cantidad', lookup_expr='gte')
    cantidad_max = django_filters.NumberFilter(field_name='cantidad', lookup_expr='lte')

    class Meta:
        model = Libro
        fields = ['titulo', 'pvp', 'precio', 'cantidad'] 