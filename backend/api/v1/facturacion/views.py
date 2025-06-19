from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from facturacion.models import Factura, LineaFactura
from .serializers import FacturaSerializer, FacturaCreateSerializer, LineaFacturaSerializer, LineaFacturaCreateSerializer, LineaFacturaUpdateSerializer
from .filters import FacturaFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError

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

    @action(detail=True, methods=['post'])
    def emitir(self, request, pk=None):
        """
        Emite una factura cambiando su estado de 'borrador' a 'emitida'
        """
        factura = self.get_object()
        
        try:
            if factura.estado != 'borrador':
                return Response(
                    {'error': 'Solo se pueden emitir facturas en estado borrador'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Cambiar estado a emitida
            factura.estado = 'emitida'
            factura.save()
            
            serializer = self.get_serializer(factura)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Error interno del servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def anular(self, request, pk=None):
        """
        Anula una factura emitida o pagada
        """
        factura = self.get_object()
        motivo = request.data.get('motivo', '').strip()
        
        if not motivo:
            return Response(
                {'error': 'El motivo de anulación es obligatorio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if factura.estado not in ['emitida', 'pagada']:
                return Response(
                    {'error': 'Solo se pueden anular facturas emitidas o pagadas'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Anular la factura
            factura.anular(motivo)
            
            serializer = self.get_serializer(factura)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Error interno del servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LineaFacturaViewSet(viewsets.ModelViewSet):
    queryset = LineaFactura.objects.all().order_by('libro__titulo')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            if self.action == 'create':
                return LineaFacturaCreateSerializer
            else:
                return LineaFacturaUpdateSerializer
        return LineaFacturaSerializer 