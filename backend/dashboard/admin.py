from django.contrib import admin
from .models import FillingStage, SensorReading


@admin.register(FillingStage)
class FillingStageAdmin(admin.ModelAdmin):
	list_display = ("number", "date", "material_type", "material_amount_kg", "active")
	list_filter = ("material_type", "active")
	search_fields = ("people",)


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
	list_display = ("stage", "timestamp", "pressure_hpa", "biol_flow", "gas_flow")
	list_filter = ("stage",)
	date_hierarchy = "timestamp"
