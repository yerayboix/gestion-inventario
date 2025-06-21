from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from facturacion.models import Factura, LineaFactura, Empresa
from .serializers import FacturaSerializer, FacturaCreateSerializer, LineaFacturaSerializer, LineaFacturaCreateSerializer, LineaFacturaUpdateSerializer, EmpresaSerializer, EmpresaUpdateSerializer
from .filters import FacturaFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from facturacion.views import factura_pdf

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

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """
        Genera y descarga el PDF de una factura
        """
        factura = self.get_object()
        return factura_pdf(request, factura.id)

class LineaFacturaViewSet(viewsets.ModelViewSet):
    queryset = LineaFactura.objects.all().order_by('libro__titulo')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            if self.action == 'create':
                return LineaFacturaCreateSerializer
            else:
                return LineaFacturaUpdateSerializer
        return LineaFacturaSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar la configuración de la empresa.
    Solo permite una empresa en la base de datos.
    """
    queryset = Empresa.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return EmpresaUpdateSerializer
        return EmpresaSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Obtiene la empresa. Si no existe, retorna 404.
        """
        empresa = Empresa.objects.first()
        if not empresa:
            return Response(
                {'error': 'No se ha configurado ninguna empresa'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(empresa)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """
        Crea la empresa. Solo permite crear una.
        """
        if Empresa.objects.exists():
            return Response(
                {'error': 'Ya existe una empresa configurada. Use PUT/PATCH para actualizarla.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Actualiza la empresa existente.
        """
        empresa = Empresa.objects.first()
        if not empresa:
            return Response(
                {'error': 'No se ha configurado ninguna empresa. Use POST para crearla.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(empresa, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Actualiza parcialmente la empresa existente.
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        No permite eliminar la empresa.
        """
        return Response(
            {'error': 'No se puede eliminar la configuración de la empresa'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        ) 