from django.urls import path
from . import views

urlpatterns = [
    path("archivos/subir/", views.subir_archivo, name="subir_archivo"),
    path('descargar/<int:recurso_id>/', views.descargar_archivo, name='descargar_archivo'),
    path("archivos/", views.lista_archivos, name="lista_archivos"),
]
