from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import PerfilSerializer
from rest_framework import permissions

class PuedeAprobarUsuarios(permissions.BasePermission):
    """
    Permiso personalizado que permite aprobar usuarios pendientes.
    Solo los usuarios autenticados con el permiso AprobarUsuarios en su perfil pueden acceder a la vista protegida.
    """
    def has_permission(self, request, view):
        """
        Verifica si el usuario está autenticado, tiene perfil y el permiso AprobarUsuarios activo.
        Args:
            request: objeto de solicitud HTTP
        Returns:
            bool: True si el usuario puede aprobar usuarios, False en caso contrario
        """
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'perfil') and 
            request.user.perfil.permisos.AprobarUsuarios  
        )