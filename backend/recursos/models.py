from django.db import models
from django import forms
from django.contrib.auth.models import User
from storages.backends.s3 import S3File
from storages.backends.s3boto3 import S3Boto3Storage
from uuid import uuid4


    
def get_recursos_s3_file_path(instance: "Recursos", filename: str):
    extension = filename.split(".")[-1]
    return f"{uuid4().hex}.{extension}"
    # return f"{uuid4().hex}.{filename.split(".")[-1]}"


class Recursos(models.Model):
    nombre = models.CharField(max_length=50)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    file = models.FileField(
        upload_to=get_recursos_s3_file_path,
        max_length=100,
    )

    def __str__(self):
        return f"Recurso no.{self.id}"
