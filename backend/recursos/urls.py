from django.urls import path
from .views import RecursosViewSet

urlpatterns = [
    # Rutas específicas para el ViewSet con institución
    path('api/<str:institucion>/recursos/', RecursosViewSet.as_view({'get': 'list', 'post': 'create'}), name='recursos-list'),
    path('api/<str:institucion>/recursos/<int:pk>/', RecursosViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='recursos-detail'),
    path('api/<str:institucion>/recursos/<int:pk>/descargar/', RecursosViewSet.as_view({'get': 'descargar'}), name='recursos-descargar'),
    path('api/<str:institucion>/recursos/mis-recursos/', RecursosViewSet.as_view({'get': 'mis_recursos'}), name='recursos-mis-recursos'),
]

