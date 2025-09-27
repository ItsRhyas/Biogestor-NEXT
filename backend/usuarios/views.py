from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User, Permission
from django.contrib.auth import login, logout, authenticate
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Perfil
import pandas as pd


PERMISOS_VISIBLES = {
    'add_productoinsumo': 'Crear producto',
    'change_productoinsumo': 'Modificar producto',
    'delete_productoinsumo': 'Eliminar producto',
    'view_productoinsumo': 'Ver inventario'
}

def signup(request):
    print(User.objects.count())

    if request.method == 'GET':
        return render(request, 'signup.html', {
            'form': UserCreationForm
        })

    elif request.method == 'POST':

        if request.POST['password1'] == request.POST['password2']:
            try:
                user = User.objects.create_user(
                    username=request.POST['username'],
                    password=request.POST['password1'])

                if user.is_superuser:
                    return redirect('signin')

                return render(request, 'signup.html', {
                    'form': UserCreationForm,
                    "error": 'Cuesta creada correctamente. Debe esperar aprbacion del administrador'
                })
            except:
                return render(request, 'signup.html', {
                    'form': UserCreationForm,
                    "error": 'El usuario ya existe'
                })

        else:
            return render(request, 'signup.html', {
                'form': UserCreationForm,
                "error": 'Las contrase;as no coinciden'
            })


@login_required
def signout(request):
    logout(request)
    return redirect('signin')


def signin(request):

    if request.method == 'GET':
        return render(request, 'signin.html', {
            'form': AuthenticationForm
        })

    else:

        user = authenticate(
            request,
            username=request.POST['username'],
            password=request.POST['password'])
        if user is None:
            return render(request, 'signin.html', {
                'form': AuthenticationForm,
                'error': 'Usuario o contrase;a incorrecta'
            })

        if not user.is_superuser and not user.perfil.aprobado:
            return render(request, 'signin.html', {
                'form': AuthenticationForm,
                'error': 'Tu cuenta a[un no ha sido aprobada por un administrador'
            })
        else:
            login(request, user)
            return redirect('home')


@login_required
@user_passes_test(lambda u: u.is_superuser)
def aprobar_usuarios(request):
    pendientes = Perfil.objects.filter(
        aprobado=False, user__is_superuser=False)

    if request.method == "POST":
        user_id = request.POST.get("user_id")
        perfil = Perfil.objects.get(user_id=user_id)
        perfil.aprobado = True
        perfil.save()

    return render(request, 'aprobar_usuarios.html', {"pendientes": pendientes})


@login_required
def ver_usuarios(request):
    aprobados = Perfil.objects.filter(aprobado=True).select_related("user")
    no_aprobados = Perfil.objects.filter(aprobado=False).select_related("user")
    todos_permisos = Permission.objects.filter(codename__in=PERMISOS_VISIBLES.keys())
    permisos_filtrados = [(permiso, PERMISOS_VISIBLES[permiso.codename]) for permiso in todos_permisos]

    return render(request, 'ver_usuarios.html', {
        'aprobados': aprobados,
        'no_aprobados': no_aprobados,
        'permisos_filtrados': permisos_filtrados,
    })

def cambiar_permisos(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        permisos = request.POST.getlist('permisos') 
        usuario = User.objects.get(id=user_id)
        usuario.user_permissions.set(Permission.objects.filter(codename__in=permisos))
        usuario.save()

    return redirect('ver_usuarios')

@login_required
def home(request):
    return render(request, 'home.html')
