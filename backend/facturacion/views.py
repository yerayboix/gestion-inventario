from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django_weasyprint import WeasyTemplateResponse
from django_weasyprint.views import WeasyTemplateResponseMixin
from django.views.generic import DetailView
from .models import Factura, Empresa
from decimal import Decimal
import gc

# Create your views here.

def factura_pdf(request, factura_id):
    """
    Genera y descarga el PDF de una factura usando django-weasyprint
    """
    try:
        factura = get_object_or_404(Factura, id=factura_id)
        
        # Obtener parámetros de la URL
        mostrar_iban = request.GET.get('mostrar_iban', 'false').lower() == 'true'
        
        # Obtener la configuración de la empresa
        empresa = Empresa.objects.first()
        
        # Obtener las líneas de la factura
        lineas = factura.lineas.all().select_related('libro')
        
        # Calcular totales
        subtotal = Decimal('0.00')
        descuento_total = Decimal('0.00')
        iva_total = Decimal('0.00')
        
        # Calcular subtotal de las líneas y preparar datos de líneas con PVP calculado
        lineas_con_pvp = []
        for linea in lineas:
            # Calcular PVP (precio + IVA)
            pvp_calculado = linea.libro.precio
            if factura.iva:
                pvp_calculado = linea.libro.precio * (1 + factura.iva / Decimal('100'))
            
            lineas_con_pvp.append({
                'linea': linea,
                'pvp_calculado': pvp_calculado
            })
            
            subtotal += linea.importe or Decimal('0.00')
        
        # Calcular descuento general si existe
        if factura.descuento and factura.base_iva:
            descuento_total = (factura.base_iva * factura.descuento) / Decimal('100')
        
        # Calcular IVA si existe
        if factura.iva and factura.base_iva:
            iva_total = (factura.base_iva * factura.iva) / Decimal('100')
        
        # Preparar el contexto con todos los cálculos hechos
        context = {
            'factura': factura,
            'empresa': empresa,
            'lineas_con_pvp': lineas_con_pvp,
            'subtotal': subtotal,
            'descuento_total': descuento_total,
            'iva_total': iva_total,
            'gastos_envio': factura.gastos_envio or Decimal('0.00'),
            'total': factura.total or Decimal('0.00'),
            'mostrar_iban': mostrar_iban,
        }
        
        # Usar WeasyTemplateResponse para generar el PDF
        filename = f"factura_{factura.numero or factura.numero_borrador or factura.id}.pdf"
        
        response = WeasyTemplateResponse(
            request=request,
            template='facturas/factura_pdf.html',
            context=context,
            filename=filename,
            content_type='application/pdf'
        )
        
        # Configurar headers para descarga
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        # Log del error para debugging
        print(f"Error generando PDF para factura {factura_id}: {str(e)}")
        return HttpResponse("Error generando PDF", status=500)


class FacturaPDFView(WeasyTemplateResponseMixin, DetailView):
    """
    Vista basada en clase para generar PDFs de facturas usando django-weasyprint
    """
    model = Factura
    template_name = 'facturas/factura_pdf.html'
    pdf_filename = 'factura.pdf'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        factura = self.get_object()
        
        # Obtener parámetros de la URL
        mostrar_iban = self.request.GET.get('mostrar_iban', 'false').lower() == 'true'
        
        # Obtener la configuración de la empresa
        empresa = Empresa.objects.first()
        
        # Obtener las líneas de la factura
        lineas = factura.lineas.all().select_related('libro')
        
        # Calcular totales
        subtotal = Decimal('0.00')
        descuento_total = Decimal('0.00')
        iva_total = Decimal('0.00')
        
        # Calcular subtotal de las líneas y preparar datos de líneas con PVP calculado
        lineas_con_pvp = []
        for linea in lineas:
            # Calcular PVP (precio + IVA)
            pvp_calculado = linea.libro.precio
            if factura.iva:
                pvp_calculado = linea.libro.precio * (1 + factura.iva / Decimal('100'))
            
            lineas_con_pvp.append({
                'linea': linea,
                'pvp_calculado': pvp_calculado
            })
            
            subtotal += linea.importe or Decimal('0.00')
        
        # Calcular descuento general si existe
        if factura.descuento and factura.base_iva:
            descuento_total = (factura.base_iva * factura.descuento) / Decimal('100')
        
        # Calcular IVA si existe
        if factura.iva and factura.base_iva:
            iva_total = (factura.base_iva * factura.iva) / Decimal('100')
        
        # Actualizar el contexto
        context.update({
            'empresa': empresa,
            'lineas_con_pvp': lineas_con_pvp,
            'subtotal': subtotal,
            'descuento_total': descuento_total,
            'iva_total': iva_total,
            'gastos_envio': factura.gastos_envio or Decimal('0.00'),
            'total': factura.total or Decimal('0.00'),
            'mostrar_iban': mostrar_iban,
        })
        
        return context
    
    def get_pdf_filename(self):
        """Genera el nombre del archivo PDF basado en la factura"""
        factura = self.get_object()
        numero = factura.numero or factura.numero_borrador or factura.id
        return f"factura_{numero}.pdf"
