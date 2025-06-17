from django.db import models
from inventario.models import Libro

class Factura(models.Model):
    ESTADOS_FACTURA = [
        ("borrador", "Borrador"),
        ("emitida", "Emitida"),
        ("pagada", "Pagada"),
        ("anulada", "Anulada"),
    ]
    numero = models.CharField(max_length=30, blank=True, null=True)
    fecha = models.DateField()
    cliente = models.CharField(max_length=255, blank=True, null=True)
    nombre = models.CharField(max_length=255, blank=True, null=True)
    nif = models.CharField(max_length=20, blank=True, null=True)
    domicilio = models.CharField(max_length=255, blank=True, null=True)
    cp_ciudad = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    base_iva = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    iva = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    recargo_equivalencia = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    notas = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=10, choices=ESTADOS_FACTURA, default="borrador")
    fecha_pago = models.DateField(blank=True, null=True)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        ordering = ["-fecha", "-numero"]

    def __str__(self):
        return f"Factura {self.numero or self.id} - {self.estado.title()}"


class LineaFactura(models.Model):
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    importe = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)