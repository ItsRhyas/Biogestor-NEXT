from django.db import models
from django import forms
from django.contrib.auth.models import User
from storages.backends.s3 import S3File
from storages.backends.s3boto3 import S3Boto3Storage
from uuid import uuid4
from usuarios.models import Instituciones

def get_recursos_s3_file_path(instance: "Recursos", filename: str):
    extension = filename.split(".")[-1]
    return f"{uuid4().hex}.{extension}"

class Recursos(models.Model):
    TIPO_ACCESO_CHOICES = [
        ('publico', 'Público'),
        ('privado', 'Privado'),
    ]
    
    nombre = models.CharField(max_length=50)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    tipo_acceso = models.CharField(
        max_length=10, 
        choices=TIPO_ACCESO_CHOICES, 
        default='privado'
    )
    
    # Relación con la institución propietaria
    institucion = models.ForeignKey(
        Instituciones, 
        on_delete=models.CASCADE,
        related_name='recursos'
    )
    
    # Relación con el usuario que subió el recurso
    usuario_subio = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recursos_subidos'
    )

    file = models.FileField(
        upload_to=get_recursos_s3_file_path,
        max_length=100,
    )

    def __str__(self):
        return f"Recurso no.{self.id} - {self.nombre}"
