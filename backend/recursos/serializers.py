from rest_framework import permissions, serializers
from .models import Recursos
from usuarios.models import Instituciones
from django.contrib.auth.models import User

# Permission Classes
class PuedeSubirRecursos(permissions.BasePermission):
    """
    Permiso para verificar si el usuario puede subir recursos
    """
    def has_permission(self, request, view):
        return (
            hasattr(request.user, 'perfil') and 
            request.user.perfil.permisos.SubirRecursos and
            request.user.perfil.aprobado
        )

class PuedeDescargarRecursos(permissions.BasePermission):
    """
    Permiso para verificar si el usuario puede descargar recursos
    """
    def has_permission(self, request, view):
        return (
            hasattr(request.user, 'perfil') and 
            request.user.perfil.permisos.DescargarRecursos and
            request.user.perfil.aprobado
        )

class PuedeVerRecursos(permissions.BasePermission):
    """
    Permiso para verificar si el usuario puede ver recursos
    """
    def has_permission(self, request, view):
        return (
            hasattr(request.user, 'perfil') and 
            request.user.perfil.permisos.VerRecursos and
            request.user.perfil.aprobado
        )

class EsPropietarioOInstitucion(permissions.BasePermission):
    """
    Permiso para verificar si el usuario es el propietario del recurso o pertenece a la misma institución
    """
    def has_object_permission(self, request, view, obj):
        if not hasattr(request.user, 'perfil'):
            return False
        
        # El propietario puede realizar cualquier acción
        if obj.usuario_subio == request.user:
            return True
        
        # Usuarios de la misma institución pueden acceder a recursos privados
        if obj.tipo_acceso == 'privado':
            return obj.institucion == request.user.perfil.institucion
        
        # Cualquier usuario autenticado puede acceder a recursos públicos
        return True

# Serializer Classes
class RecursosSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source='institucion.Nombre', read_only=True)
    usuario_subio_username = serializers.CharField(source='usuario_subio.username', read_only=True)

    class Meta:
        model = Recursos
        fields = [
            'id', 'nombre', 'file', 'fecha_subida', 'tipo_acceso',
            'institucion', 'institucion_nombre', 'usuario_subio', 'usuario_subio_username'
        ]
        read_only_fields = ['fecha_subida', 'institucion', 'usuario_subio']

class RecursosCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recursos
        fields = ['nombre', 'file', 'tipo_acceso']
