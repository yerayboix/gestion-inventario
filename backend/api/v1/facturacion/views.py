from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from facturacion.models import Factura, LineaFactura
from .serializers import FacturaSerializer, LineaFacturaSerializer
from .filters import FacturaFilter

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    filterset_class = FacturaFilter
    filter_backends = [DjangoFilterBackend]

class LineaFacturaViewSet(viewsets.ModelViewSet):
    queryset = LineaFactura.objects.all()
    serializer_class = LineaFacturaSerializer 