from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Recursos
from .serializers import RecursosSerializer, RecursosCreateSerializer
from .serializers import (
    PuedeSubirRecursos, PuedeDescargarRecursos, 
    PuedeVerRecursos, EsPropietarioOInstitucion
)
from usuarios.models import Perfil, Instituciones

class RecursosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar recursos con control de permisos por institución
    """
    queryset = Recursos.objects.all()
    permission_classes = [IsAuthenticated, PuedeVerRecursos]
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'perfil'):
            return Recursos.objects.none()
            
        user_institution = self.request.user.perfil.institucion
        
        # Recursos públicos + recursos privados de la misma institución
        return Recursos.objects.filter(
            models.Q(tipo_acceso='publico') | 
            models.Q(institucion=user_institution, tipo_acceso='privado')
        ).order_by('-fecha_subida')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return RecursosCreateSerializer
        return RecursosSerializer
    
    def get_permissions(self):
        """
        Asignar permisos específicos según la acción
        """
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated, PuedeSubirRecursos]
        elif self.action == 'descargar':
            self.permission_classes = [IsAuthenticated, PuedeDescargarRecursos]
        elif self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, EsPropietarioOInstitucion]
        
        return super().get_permissions()
    
    def perform_create(self, serializer):
        """
        Asignar automáticamente la institución y usuario al crear
        """
        if not hasattr(self.request.user, 'perfil'):
            from rest_framework import serializers
            raise serializers.ValidationError("El usuario no tiene perfil asignado")
        
        perfil_usuario = self.request.user.perfil
        serializer.save(
            institucion=perfil_usuario.institucion,
            usuario_subio=self.request.user
        )
    
    @action(detail=True, methods=['get'], url_path='descargar')
    def descargar(self, request, pk=None, institucion=None):
        """
        Endpoint para obtener URL de descarga con validación de permisos
        """
        try:
            recurso = self.get_object()
            
            # Verificación adicional de permisos (por si acaso)
            if recurso.tipo_acceso == 'privado':
                if not hasattr(request.user, 'perfil'):
                    return Response(
                        {'error': 'Usuario sin perfil asignado'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                if recurso.institucion != request.user.perfil.institucion:
                    return Response(
                        {'error': 'No tienes permisos para acceder a este recurso'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            file_obj = recurso.file
            file_url = request.build_absolute_uri(file_obj.url)
            
            return Response({
                'download_url': file_url,
                'nombre': recurso.nombre,
                'tipo_acceso': recurso.tipo_acceso,
                'tamaño': file_obj.size,
                'tipo_archivo': recurso.get_tipo_archivo_display() if hasattr(recurso, 'get_tipo_archivo_display') else 'Desconocido'
            })
            
        except Recursos.DoesNotExist:
            return Response(
                {'error': 'Recurso no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='mis-recursos')
    def mis_recursos(self, request, institucion=None):
        """
        Endpoint para listar solo los recursos subidos por el usuario actual
        """
        if not hasattr(request.user, 'perfil'):
            return Response([], status=status.HTTP_200_OK)
            
        user_resources = self.get_queryset().filter(usuario_subio=request.user)
        serializer = self.get_serializer(user_resources, many=True)
        return Response(serializer.data)