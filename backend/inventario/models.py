from django.db import models

# Create your models here.

class Libro(models.Model):
    titulo = models.CharField(max_length=255)
    pvp = models.DecimalField(max_digits=10, decimal_places=2)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, default=0)
    cantidad = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Libro"
        verbose_name_plural = "Libros"

    def __str__(self):
        return self.titulo
