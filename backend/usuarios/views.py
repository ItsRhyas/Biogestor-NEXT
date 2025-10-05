from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import (
    RegistrarUsuario,
    ValidarAprobacion,
    UsuarioSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# Le sabe chapi a los views


# Enpoint para crear usuario
@api_view(['POST'])
def crear_usuario(request):
    # Crea un nuevo usuario pero sin aprobacion
    if request.method == 'POST':
        serializer = RegistrarUsuario(data=request.data)

        if serializer.is_valid():
            usuario = serializer.save()

            # Serializar el usuario creado para la respuesta
            usuario_serializer = UsuarioSerializer(usuario)

            return Response({
                'mensaje': 'Usuario registrado exitosamente. Espera aprobación del administrador.',
                'usuario': usuario_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Endpoint para iniciar sesión


class IniciarSesionView(TokenObtainPairView):
    """
    Inicia sesión y devuelve tokens + información del usuario
    """
    serializer_class = ValidarAprobacion

# Endpoint para cerrar sesióm


def cerrar_sesion(request):
    """
    Cierra sesión invalidando el token de refresh
    """
    try:
        # Obtener el token de refresh del cuerpo de la solicitud
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response(
                {'error': 'Token de refresh requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Invalidar el token
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({
            'mensaje': 'Sesión cerrada exitosamente'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': 'Token inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )

# Endpoint para aprobar usuarios


@api_view(['POST'])
def aprobar_usuario(request, usuario_id):
    """
    Aprueba un usuario (solo para administradores)
    """
    # Verificar si el usuario actual es staff/admin
    if not request.user.is_staff:
        return Response(
            {'error': 'No tienes permisos para realizar esta acción'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        usuario = User.objects.get(id=usuario_id)

        # Verificar si el usuario tiene perfil
        if not hasattr(usuario, 'perfil'):
            return Response(
                {'error': 'El usuario no tiene perfil'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Aprobar el usuario
        usuario.perfil.aprobado = True
        usuario.perfil.save()

        # Serializar el usuario actualizado
        usuario_serializer = UsuarioSerializer(usuario)

        return Response({
            'mensaje': f'Usuario {usuario.username} aprobado exitosamente',
            'usuario': usuario_serializer.data
        })

    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

# Endpoint para obtener información del usuario


@api_view(['GET'])
def obtener_usuario_actual(request):
    """
    Obtiene la información del usuario autenticado
    """
    if request.user.is_authenticated:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    else:
        return Response(
            {'error': 'Usuario no autenticado'},
            status=status.HTTP_401_UNAUTHORIZED
        )

# Endpoint para listar todos los usuarios


@api_view(['GET'])
def listar_usuarios(request):
    """
    Lista todos los usuarios aprobados (solo para administradores)
    """
    # Verificar si el usuario actual es staff/admin
    if not request.user.is_staff:
        return Response(
            {'error': 'No tienes permisos para realizar esta acción'},
            status=status.HTTP_403_FORBIDDEN
        )

    usuarios = User.objects.filter(perfil__aprobado=True)
    serializer = UsuarioSerializer(usuarios, many=True)

    return Response({
        'total': usuarios.count(),
        'usuarios': serializer.data
    })

# Endpoint para listar usuarios pendientes de aprobación


@api_view(['GET'])
def usuarios_pendientes(request):
    """
    Lista usuarios pendientes de aprobación (solo para administradores)
    """
    if not request.user.is_staff:
        return Response(
            {'error': 'No tienes permisos para realizar esta acción'},
            status=status.HTTP_403_FORBIDDEN
        )

    usuarios_pendientes = User.objects.filter(perfil__aprobado=False)
    serializer = UsuarioSerializer(usuarios_pendientes, many=True)

    return Response({
        'total_pendientes': usuarios_pendientes.count(),
        'usuarios': serializer.data
    })
