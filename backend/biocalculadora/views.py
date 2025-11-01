from django import forms
from django.shortcuts import render
from .calculators import estimate, estimate_timeseries_for_material
from .forms import CalcForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

def form_view(request):
    result = None
    if request.method == "POST":
        form = CalcForm(request.POST)
        if form.is_valid():
            vs = form.cleaned_data["vs_per_day"]
            vol = form.cleaned_data.get("reactor_volume") or None
            temp = form.cleaned_data.get("temperature") or 35.0
            hrt = form.cleaned_data["HRT"]

            # costos
            costs = {
                "vs_cost_per_kg": form.cleaned_data.get("vs_cost_per_kg", 0.0),
                "water_cost_per_m3": form.cleaned_data.get("water_cost_per_m3", 0.0),
                "water_m3_per_day": form.cleaned_data.get("water_m3_per_day", 0.0),
                "additives_cost_per_day": form.cleaned_data.get("additives_cost_per_day", 0.0),
            }

            result = estimate(
                            biowaste_vs_kg_per_day=vs,
                            reactor_volume_m3=vol,
                            temperature_c=temp,
                            HRT_days=hrt,
                            vs_cost_per_kg=costs.get("vs_cost_per_kg", 0.0),
                            water_cost_per_m3=costs.get("water_cost_per_m3", 0.0),
                            water_m3_per_day=costs.get("water_m3_per_day", 0.0),
                            additives_cost_per_day=costs.get("additives_cost_per_day", 0.0)
                    )

    else:
        form = CalcForm()
    return render(request, "biocalc/form.html", {"form": form, "result": result})


class EstimateBiogasAPIView(APIView):
    """
    API: estimación de producción (serie temporal) para biodigestores de bolsa.
    Params: material_type (bovino|porcino|vegetal), vs_per_day (kg), temperature (°C),
            reactor_volume (opcional), HRT (opcional), target_fraction (0-1 opcional)
    """
    def post(self, request):
        try:
            data = request.data
            material_type = str(data.get('material_type', 'bovino')).lower()
            vs_per_day = float(data.get('vs_per_day'))
            temperature = float(data.get('temperature', 35.0))
            reactor_volume = data.get('reactor_volume')
            reactor_volume = float(reactor_volume) if reactor_volume not in (None, '',) else None
            HRT = data.get('HRT')
            HRT = float(HRT) if HRT not in (None, '',) else None
            target_fraction = float(data.get('target_fraction', 0.95))

            series = estimate_timeseries_for_material(
                material_type=material_type,
                vs_kg_per_day=vs_per_day,
                reactor_volume_m3=reactor_volume,
                temperature_c=temperature,
                target_fraction=target_fraction,
                HRT_days=HRT,
            )
            return Response(series, status=status.HTTP_200_OK)
        except (ValueError, KeyError) as e:
            return Response({"detail": f"Entrada inválida: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Error interno: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)