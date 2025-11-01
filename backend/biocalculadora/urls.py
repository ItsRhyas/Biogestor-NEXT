from django.urls import path
from . import views

urlpatterns = [
    path("calculadora/", views.form_view, name="biocalc_form"),
    path("api/biocalculadora/estimate/", views.EstimateBiogasAPIView.as_view(), name="biocalc_estimate_api"),
]