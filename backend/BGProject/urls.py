from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usuarios.urls')),
    path('',include('inventario.urls')),
    path('',include('recursos.urls')),
    path('',include('biocalculadora.urls'))
]
