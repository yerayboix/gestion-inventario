import django_filters
from facturacion.models import Factura

class FacturaFilter(django_filters.FilterSet):
    numero = django_filters.CharFilter(lookup_expr='icontains')
    cliente = django_filters.CharFilter(lookup_expr='icontains')
    nombre = django_filters.CharFilter(lookup_expr='icontains')
    estado = django_filters.ChoiceFilter(choices=Factura.ESTADOS_FACTURA)
    fecha = django_filters.DateFromToRangeFilter()
    fecha_pago = django_filters.DateFromToRangeFilter()
    total_min = django_filters.NumberFilter(field_name='total', lookup_expr='gte')
    total_max = django_filters.NumberFilter(field_name='total', lookup_expr='lte')

    class Meta:
        model = Factura
        fields = ['numero', 'cliente', 'nombre', 'estado', 'fecha', 'fecha_pago', 'total'] 