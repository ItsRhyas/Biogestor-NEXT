from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models 
from .models import Perfil, Permisos

@receiver(post_save, sender=User)
def crear_perfil(sender, instance, created, **kwargs):
    if created:
        # VERIFICAR si es el primer usuario
        es_primer_usuario = User.objects.count() == 1
        
        # CREAR objeto Permisos (OBLIGATORIO)
        permisos = Permisos.objects.create()
        
        # Si es el primer usuario, darle TODOS los permisos
        if es_primer_usuario:
            # Hacerlo superusuario y staff
            instance.is_superuser = True
            instance.is_staff = True
            instance.save()
            
            # Darle TODOS los permisos
            for field in permisos._meta.fields:
                if isinstance(field, models.BooleanField) and field.name != 'id':
                    setattr(permisos, field.name, True)
            permisos.save()
        
        # CREAR Perfil con los permisos
        perfil = Perfil.objects.create(user=instance, permisos=permisos)
        
        # Si es primer usuario, aprobarlo automáticamente
        if es_primer_usuario:
            perfil.aprobado = True
            perfil.save()