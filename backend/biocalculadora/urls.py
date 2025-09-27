from django.urls import path
from . import views

urlpatterns = [
    path("calculadora/", views.form_view, name="biocalc_form"),
]
