from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import get_user_model
from inventario.models import Libro
from decimal import Decimal

User = get_user_model()

class Factura(models.Model):
    ESTADOS_FACTURA = [
        ("borrador", "Borrador"),
        ("emitida", "Emitida"),
        ("pagada", "Pagada"),
        ("anulada", "Anulada"),
    ]

    # Números de factura
    numero_borrador = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="Número temporal para borradores"
    )
    numero = models.CharField(
        max_length=30, 
        blank=True, 
        null=True, 
        unique=True,
        help_text="Número oficial de factura"
    )

    # Datos básicos
    fecha = models.DateField(
        help_text="Fecha de emisión de la factura"
    )
    cliente = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Nombre del cliente"
    )
    nombre = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Nombre comercial o de facturación"
    )
    nif = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="NIF/CIF del cliente"
    )
    domicilio = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Dirección de facturación"
    )
    cp_ciudad = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Código postal y ciudad"
    )
    telefono = models.CharField(
        max_length=30, 
        blank=True, 
        null=True,
        help_text="Teléfono de contacto"
    )

    # Campos financieros
    descuento = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Descuento general aplicado a la factura (%)"
    )
    base_iva = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Base imponible antes de IVA"
    )
    iva = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        default=21.00,
        help_text="Porcentaje de IVA aplicado"
    )
    recargo_equivalencia = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Porcentaje de recargo de equivalencia"
    )
    gastos_envio = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Gastos de envío"
    )
    total = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Importe total de la factura"
    )

    # Campos adicionales
    notas = models.TextField(
        blank=True, 
        null=True,
        help_text="Notas o comentarios adicionales"
    )
    estado = models.CharField(
        max_length=10, 
        choices=ESTADOS_FACTURA, 
        default="borrador",
        help_text="Estado actual de la factura"
    )
    fecha_pago = models.DateField(
        blank=True, 
        null=True,
        help_text="Fecha en que se realizó el pago"
    )

    # Campos de anulación
    motivo_anulacion = models.TextField(
        blank=True, 
        null=True,
        help_text="Motivo por el que se anuló la factura"
    )
    fecha_anulacion = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Fecha y hora en que se anuló la factura"
    )

    # Campos de auditoría
    created_on = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de creación"
    )
    updated_on = models.DateTimeField(
        auto_now=True,
        help_text="Fecha y hora de última modificación"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='facturas_creadas',
        null=True,
        help_text="Usuario que creó la factura"
    )

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        ordering = ["-fecha", "-numero"]

    def __str__(self):
        if self.numero:
            return f"Factura {self.numero} - {self.get_estado_display()}"
        return f"Factura {self.numero_borrador or self.id} - {self.get_estado_display()}"

    def reducir_stock_libros(self):
        """
        Reduce el stock de todos los libros en las líneas de la factura
        """
        for linea in self.lineas.all():
            libro = linea.libro
            if libro.cantidad >= linea.cantidad:
                libro.cantidad -= linea.cantidad
                libro.save()
            else:
                raise ValidationError(
                    f"No hay suficiente stock del libro '{libro.titulo}'. "
                    f"Stock disponible: {libro.cantidad}, Cantidad solicitada: {linea.cantidad}"
                )

    def recuperar_stock_libros(self):
        """
        Recupera el stock de todos los libros en las líneas de la factura
        """
        for linea in self.lineas.all():
            libro = linea.libro
            libro.cantidad += linea.cantidad
            libro.save()

    def verificar_stock_disponible(self):
        """
        Verifica que haya suficiente stock para todos los libros en la factura
        """
        for linea in self.lineas.all():
            libro = linea.libro
            if libro.cantidad < linea.cantidad:
                raise ValidationError(
                    f"No hay suficiente stock del libro '{libro.titulo}'. "
                    f"Stock disponible: {libro.cantidad}, Cantidad solicitada: {linea.cantidad}"
                )

    def generar_numero_factura(self):
        """
        Genera el siguiente número de factura disponible para el año de la factura
        """
        from django.db.models import Max
        año_factura = self.fecha.year
        
        # Buscar la última factura del año de la factura
        ultima_factura = Factura.objects.filter(
            numero__startswith=f'F-{año_factura}-',
            estado__in=['emitida', 'pagada', 'anulada']
        ).aggregate(
            Max('numero')
        )['numero__max']
        
        if ultima_factura:
            ultimo_numero = int(ultima_factura.split('-')[-1])
            siguiente_numero = ultimo_numero + 1
        else:
            siguiente_numero = 1
            
        return f'F-{año_factura}-{siguiente_numero:04d}'

    def generar_numero_borrador(self):
        """
        Genera un número temporal para el borrador basado en la fecha de la factura
        """
        # Usar el ID si está disponible, sino usar un timestamp único
        if self.pk:
            return f'BORRADOR-{self.fecha.year}-{self.pk}'
        else:
            return f'BORRADOR-{self.fecha.year}'

    def calcular_totales(self):
        """
        Calcula los totales de la factura basándose en sus líneas
        """
        # Calcular base imponible
        base = sum(linea.importe or Decimal('0.00') for linea in self.lineas.all())
        
        # Aplicar descuento general si existe
        if self.descuento:
            base = base * (1 - (self.descuento / Decimal('100.00')))
        
        self.base_iva = base
        
        # Calcular IVA
        importe_iva = Decimal('0.00')
        if self.iva:
            importe_iva = base * (Decimal(self.iva) / Decimal('100.00'))
    
        importe_gastos_envio = Decimal('0.00')
        if self.gastos_envio:
            importe_gastos_envio = self.gastos_envio
        
        # Calcular total
        self.total = base + importe_iva + importe_gastos_envio

    def clean(self):
        """
        Validaciones adicionales del modelo
        """
        if self.estado == 'emitida' and not self.cliente:
            raise ValidationError('Una factura emitida debe tener un cliente')
        
        if self.estado == 'pagada' and not self.fecha_pago:
            raise ValidationError('Una factura pagada debe tener fecha de pago')

    def save(self, *args, **kwargs):
        is_new = not self.pk
        estado_anterior = None
        
        if not is_new:
            # Obtener el estado anterior para detectar cambios
            try:
                factura_anterior = Factura.objects.get(pk=self.pk)
                estado_anterior = factura_anterior.estado
            except Factura.DoesNotExist:
                pass
        
        # Si es una nueva factura y es borrador, generar número de borrador
        if is_new and self.estado == 'borrador':
            self.numero_borrador = self.generar_numero_borrador()
        
        # Si estamos cambiando de borrador a emitida
        if not is_new and self.estado == 'emitida' and not self.numero:
            self.numero = self.generar_numero_factura()
            self.numero_borrador = None
        
        # Guardar la factura primero
        super().save(*args, **kwargs)
        
        # Control de stock según el estado
        if is_new and self.estado == 'borrador':
            # Nueva factura en borrador: verificar y reducir stock
            self.verificar_stock_disponible()
            self.reducir_stock_libros()
        elif not is_new and estado_anterior == 'borrador' and self.estado == 'emitida':
            # Cambio de borrador a emitida: el stock ya está reducido, no hacer nada
            pass
        elif not is_new and estado_anterior in ['emitida', 'pagada'] and self.estado == 'anulada':
            # Anulación de factura emitida: recuperar stock
            self.recuperar_stock_libros()
        
        # Calcular totales solo si la factura ya tiene ID (no es nueva)
        if not is_new:
            self.calcular_totales()
            # Guardar solo los campos calculados sin llamar a save() completo
            Factura.objects.filter(pk=self.pk).update(
                base_iva=self.base_iva,
                total=self.total
            )
        
        # Si es nueva y es borrador, actualizar el número de borrador con el ID real
        if is_new and self.estado == 'borrador':
            self.numero_borrador = f'BORRADOR-{self.fecha.year}-{self.pk}'
            # Guardar solo el numero_borrador sin llamar a save() completo
            Factura.objects.filter(pk=self.pk).update(numero_borrador=self.numero_borrador)

    def anular(self, motivo):
        """
        Anula una factura emitida
        """
        if self.estado == 'borrador':
            raise ValidationError("No se puede anular un borrador")
            
        if self.estado == 'anulada':
            raise ValidationError("La factura ya está anulada")
        
        # Recuperar stock si la factura estaba emitida o pagada
        if self.estado in ['emitida', 'pagada']:
            self.recuperar_stock_libros()
        
        self.estado = 'anulada'
        self.motivo_anulacion = motivo
        self.fecha_anulacion = timezone.now()
        self.save()

    def delete(self, *args, **kwargs):
        """
        Previene la eliminación de facturas que no sean borradores
        y recupera el stock si se elimina un borrador
        """
        if self.estado != 'borrador':
            raise ValidationError(
                "No se pueden eliminar facturas emitidas. Use anulación en su lugar."
            )
        
        # Si es un borrador, recuperar el stock antes de eliminar
        if self.estado == 'borrador':
            self.recuperar_stock_libros()
        
        super().delete(*args, **kwargs)


class LineaFactura(models.Model):
    factura = models.ForeignKey(
        Factura, 
        on_delete=models.CASCADE,
        related_name='lineas',
        help_text="Factura a la que pertenece esta línea"
    )
    libro = models.ForeignKey(
        Libro, 
        on_delete=models.PROTECT,
        help_text="Libro vendido"
    )
    cantidad = models.IntegerField(
        help_text="Cantidad de libros"
    )
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Precio unitario"
    )
    descuento = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Descuento aplicado a esta línea (%)"
    )
    importe = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Importe total de la línea"
    )

    # Campos de auditoría
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def clean(self):
        """
        Validaciones adicionales del modelo
        """
        if self.cantidad <= 0:
            raise ValidationError('La cantidad debe ser mayor que 0')
        
        if self.precio < 0:
            raise ValidationError('El precio no puede ser negativo')
        
        # Verificar stock disponible solo si la factura es borrador
        if self.factura and self.factura.estado == 'borrador':
            if self.libro.cantidad < self.cantidad:
                raise ValidationError(
                    f'No hay suficiente stock del libro "{self.libro.titulo}". '
                    f'Stock disponible: {self.libro.cantidad}, Cantidad solicitada: {self.cantidad}'
                )

    def calcular_importe(self):
        """
        Calcula el importe total de la línea
        """
        importe = self.cantidad * self.precio
        
        if self.descuento:
            importe = importe * (1 - (self.descuento / Decimal('100.00')))
            
        return importe.quantize(Decimal('0.01'))

    def save(self, *args, **kwargs):
        is_new = not self.pk
        cantidad_anterior = 0
        
        if not is_new:
            # Obtener la cantidad anterior para detectar cambios
            try:
                linea_anterior = LineaFactura.objects.get(pk=self.pk)
                cantidad_anterior = linea_anterior.cantidad
            except LineaFactura.DoesNotExist:
                pass
        
        # Calcular importe
        self.importe = self.calcular_importe()
        
        super().save(*args, **kwargs)
        
        # Control de stock para cambios en líneas de facturas en borrador
        if self.factura.estado == 'borrador':
            if is_new:
                # Nueva línea: reducir stock
                if self.libro.cantidad >= self.cantidad:
                    self.libro.cantidad -= self.cantidad
                    self.libro.save()
                else:
                    raise ValidationError(
                        f"No hay suficiente stock del libro '{self.libro.titulo}'. "
                        f"Stock disponible: {self.libro.cantidad}, Cantidad solicitada: {self.cantidad}"
                    )
            elif not is_new and cantidad_anterior != self.cantidad:
                # Línea modificada: ajustar stock
                diferencia = self.cantidad - cantidad_anterior
                if diferencia > 0:
                    # Aumentó la cantidad: reducir más stock
                    if self.libro.cantidad >= diferencia:
                        self.libro.cantidad -= diferencia
                        self.libro.save()
                    else:
                        raise ValidationError(
                            f"No hay suficiente stock del libro '{self.libro.titulo}'. "
                            f"Stock disponible: {self.libro.cantidad}, Cantidad adicional solicitada: {diferencia}"
                        )
                else:
                    # Disminuyó la cantidad: recuperar stock
                    self.libro.cantidad += abs(diferencia)
                    self.libro.save()
        
        # Recalcular totales de la factura usando update para evitar recursión
        self.factura.calcular_totales()
        Factura.objects.filter(pk=self.factura.pk).update(
            base_iva=self.factura.base_iva,
            total=self.factura.total
        )

    def delete(self, *args, **kwargs):
        """
        Recupera el stock cuando se elimina una línea de factura en borrador
        """
        if self.factura.estado == 'borrador':
            # Recuperar stock antes de eliminar la línea
            self.libro.cantidad += self.cantidad
            self.libro.save()
        
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = "Línea de Factura"
        verbose_name_plural = "Líneas de Factura"
        ordering = ['id']

    def __str__(self):
        return f"{self.cantidad}x {self.libro.titulo} - {self.importe}€"