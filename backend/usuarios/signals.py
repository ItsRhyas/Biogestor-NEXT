from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Perfil

@receiver(post_save, sender=User)
def crear_perfil(sender, instance, created, **kwargs): 
    if created:
        if User.objects.count() ==1:
            instance.is_superuser = True
            instance.is_staff = True
            instance.save()
            Perfil.objects.create(user=instance, aprobado=True)
            print("Super usuario ha sido creado con exito")
        else:  Perfil.objects.create(user=instance)