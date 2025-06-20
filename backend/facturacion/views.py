from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from weasyprint import HTML
from django.template.loader import render_to_string
from .models import Factura
from decimal import Decimal

# Create your views here.

def factura_pdf(request, factura_id):
    """
    Genera y descarga el PDF de una factura
    """
    factura = get_object_or_404(Factura, id=factura_id)
    
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
        'lineas_con_pvp': lineas_con_pvp,
        'subtotal': subtotal,
        'descuento_total': descuento_total,
        'iva_total': iva_total,
        'gastos_envio': factura.gastos_envio or Decimal('0.00'),
        'total': factura.total or Decimal('0.00'),
    }
    
    # Renderizar el template HTML
    html_content = render_to_string('facturas/factura_pdf.html', context)
    
    # Crear el PDF
    html = HTML(string=html_content)
    pdf_bytes = html.write_pdf()
    
    # Crear la respuesta HTTP
    filename = f"factura_{factura.numero or factura.numero_borrador or factura.id}.pdf"
    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response
