from django.urls import path
from .views import (
    CrearProductoConInsumosView,
    ProductoListCreateView, ProductoDetailView,
    InsumoListCreateView, InsumoDetailView,
    obtener_insumos
)

urlpatterns = [
    # Productos
    path('productos/', ProductoListCreateView.as_view(),
         name='productos-list-create'),
    path('productos/<int:pk>/', ProductoDetailView.as_view(),
         name='productos-detail'),

    # Insumos
    path('insumos/', InsumoListCreateView.as_view(), name='insumos-list-create'),
    path('insumos/<int:pk>/', InsumoDetailView.as_view(), name='insumos-detail'),

    # Crear producto con insumos
    path('productos/crear_con_insumos/',
         CrearProductoConInsumosView.as_view(), name='crear-producto-insumos'),

    # Obtener insumos por lista de IDs de productos
    path('productos/insumos/', obtener_insumos, name='obtener-insumos'),
]
