from django import forms

class CalcForm(forms.Form):
    vs_per_day = forms.FloatField(label="Materia orgánica (kg VS / día)", min_value=0.0)
    reactor_volume = forms.FloatField(label="Volumen del biodigestor (m³) (opcional)", required=False)
    temperature = forms.FloatField(label="Temperatura (°C)", initial=28.0)
    HRT = forms.FloatField(label="Tiempo de retención (días)", initial=30.0)

    # --- costos ---
    vs_cost_per_kg = forms.FloatField(label="Costo por kg de VS (USD)", initial=0.0, required=False)
    water_cost_per_m3 = forms.FloatField(label="Costo agua (USD/m³)", initial=0.0, required=False)
    water_m3_per_day = forms.FloatField(label="Consumo agua (m³/día)", initial=0.0, required=False)
    additives_cost_per_day = forms.FloatField(label="Aditivos (USD/día)", initial=0.0, required=False)
