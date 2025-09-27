from django.db import models


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    peso = models.DecimalField(max_digits=10, decimal_places=2)
    tamaño = models.CharField(max_length=50)
    presentacion = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Insumo(models.Model):
    nombre = models.CharField(max_length=100)
    unidad_medida = models.CharField(max_length=50, default='unidades')

    def __str__(self):
        return f"{self.nombre} ({self.unidad_medida})"


class ProductoInsumo(models.Model):
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name='producto_insumo')
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    observaciones = models.TextField(blank=True)

    class Meta:
        unique_together = ['producto', 'insumo']

    def __str__(self):
        return f"{self.producto} - {self.insumo} ({self.cantidad})"
