from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from facturacion.models import Factura, LineaFactura
from .serializers import FacturaSerializer, LineaFacturaSerializer
from .filters import FacturaFilter
from rest_framework.decorators import action
from rest_framework.response import Response

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by('-fecha')
    serializer_class = FacturaSerializer
    filterset_class = FacturaFilter
    filter_backends = [DjangoFilterBackend]

    @action(detail=True, methods=['get'])
    def lineas(self, request, pk=None):
        factura = self.get_object()
        lineas = LineaFactura.objects.filter(factura=factura)
        serializer = LineaFacturaSerializer(lineas, many=True)
        return Response(serializer.data)

class LineaFacturaViewSet(viewsets.ModelViewSet):
    queryset = LineaFactura.objects.all().order_by('libro__titulo')
    serializer_class = LineaFacturaSerializer 