from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Producto, Insumo, ProductoInsumo
from .serializers import ProductoSerializer, InsumoSerializer, ProductoInsumoSerializer


# crud de DRF para productos e insumos

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer

# personalizado para crear productos con insumos relacionados (de negocio segun chapi)


class CrearProductoConInsumosView(generics.CreateAPIView):
    serializer_class = ProductoInsumoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        producto_creado = serializer.save()
        return Response({
            'mensaje': 'Producto e insumos creados exitosamente',
            'producto': ProductoSerializer(producto_creado).data,
            'relaciones_creadas': len(request.data.get('insumos', []))
        }, status=status.HTTP_201_CREATED)


# Obtener insumos de productos específicos
@api_view(['POST'])
def obtener_insumos(request):
    producto_ids = request.data.get('producto_ids', [])
    relaciones = ProductoInsumo.objects.filter(producto_id__in=producto_ids)

    resultado = {}
    for rel in relaciones:
        pid = rel.producto.id
        if pid not in resultado:
            resultado[pid] = {
                "producto": {
                    "id": rel.producto.id,
                    "nombre": rel.producto.nombre,
                    "peso": str(rel.producto.peso),
                    "tamaño": rel.producto.tamaño,
                    "presentacion": rel.producto.presentacion
                },
                "insumos": []
            }
        resultado[pid]["insumos"].append({
            "id": rel.insumo.id,
            "nombre": rel.insumo.nombre,
            "unidad_medida": rel.insumo.unidad_medida,
            "cantidad": str(rel.cantidad),
            "observaciones": rel.observaciones
        })

    return Response(list(resultado.values()))
