from django.shortcuts import render, redirect, HttpResponse
from .models import Recursos
from django.conf import settings

def subir_archivo(request):
    
    if request.method == 'POST':
        
        Nombre = request.POST.get("nombre")
        file = request.FILES.get("archivo")
        
        if Nombre and file:
        
            upload = Recursos(nombre=Nombre, file=file)
            upload.save()
            image_url = upload.file.url
            print(image_url)
            return redirect("lista_archivos")
        
        else:

            return HttpResponse("Faltan datos en el formulario", status=400)
    
    
    return render(request, "subir.html")
    

def descargar_archivo(request, recurso_id):
    try:
        recurso = Recursos.objects.get(id=recurso_id)
        file_obj = recurso.file  # esto es un FieldFile de Django
        file_url = file_obj.url  # URL pública o firmada según tu configuración

        # Opción 1: Redirigir al URL de S3 (más simple)
        from django.shortcuts import redirect
        return redirect(file_url)

        # Opción 2: Descargar y servir desde Django (menos eficiente)
        # contenido = file_obj.read()
        # response = HttpResponse(contenido, content_type='application/octet-stream')
        # response['Content-Disposition'] = f'attachment; filename="{file_obj.name}"'
        # return response

    except Recursos.DoesNotExist:
        return HttpResponse("Recurso no encontrado", status=404)



def lista_archivos(request):
    archivos = Recursos.objects.all()
    return render(request, "lista_archivos.html", {"archivos": archivos})