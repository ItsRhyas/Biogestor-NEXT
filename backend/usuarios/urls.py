from django.urls import path
from . import views 

urlpatterns = [
    path('signup/', views.signup, name = 'signup'),
    path('logout/', views.signout, name = 'logout'),
    path ('signin/', views.signin, name = 'signin'),
    path ('home/', views.home, name = 'home'),
    path('aprobar/', views.aprobar_usuarios, name='aprobar_usuarios'),
    path('usuarios/', views.ver_usuarios, name='ver_usuarios'),
    path('Cambiar_permisos/',views.cambiar_permisos, name='cambiar_permisos')
]