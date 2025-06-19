from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from facturacion.models import Factura, LineaFactura
from .serializers import FacturaSerializer, FacturaCreateSerializer, LineaFacturaSerializer, LineaFacturaCreateSerializer, LineaFacturaUpdateSerializer
from .filters import FacturaFilter
from rest_framework.decorators import action
from rest_framework.response import Response

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by('-fecha')
    filterset_class = FacturaFilter
    filter_backends = [DjangoFilterBackend]

    def get_serializer_class(self):
        if self.action == 'create':
            return FacturaCreateSerializer
        return FacturaSerializer

    @action(detail=True, methods=['get'])
    def lineas(self, request, pk=None):
        factura = self.get_object()
        lineas = factura.lineas.all()
        serializer = LineaFacturaSerializer(lineas, many=True)
        return Response(serializer.data)

class LineaFacturaViewSet(viewsets.ModelViewSet):
    queryset = LineaFactura.objects.all().order_by('libro__titulo')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            if self.action == 'create':
                return LineaFacturaCreateSerializer
            else:
                return LineaFacturaUpdateSerializer
        return LineaFacturaSerializer 