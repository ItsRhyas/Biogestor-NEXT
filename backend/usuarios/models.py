from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Perfil(models.Model):
    # Gracias al related_name = 'perfil' el atributo user puede accedet a su clase padre, básicamente es hacerle saber
    # el perfil en específico al que pertenece.

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='perfil')
    aprobado = models.BooleanField(default=False)

    def __str__(self):
        return f'Perfil de {self.user.username} - {"Aprobado" if self.aprobado else "Pendiente"}'
