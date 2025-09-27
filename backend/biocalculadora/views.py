from django import forms
from django.shortcuts import render
from .calculators import estimate
from .forms import CalcForm

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
