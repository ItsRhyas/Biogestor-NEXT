from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model


from django.contrib.auth import get_user_model

class Report(models.Model):
	REPORT_TYPE_CHOICES = [
		("normal", "Reporte regular"),
		("final", "Reporte final de producción"),
	]
	user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
	stage = models.ForeignKey('FillingStage', on_delete=models.CASCADE, related_name='reports')
	report_type = models.CharField(max_length=10, choices=REPORT_TYPE_CHOICES)
	created_at = models.DateTimeField(auto_now_add=True)
	observations = models.TextField(blank=True, null=True)
	inferences = models.TextField(blank=True, null=True)
	production_estimated = models.FloatField(null=True, blank=True)
	production_real = models.FloatField(null=True, blank=True)
	file_pdf = models.FileField(upload_to='reports/pdf/', blank=True, null=True)
	file_excel = models.FileField(upload_to='reports/excel/', blank=True, null=True)
	file_csv = models.FileField(upload_to='reports/csv/', blank=True, null=True)

	def __str__(self):
		return f"Reporte {self.report_type} - Llenado #{self.stage.number} ({self.created_at.date()})"

class FillingStage(models.Model):
	MATERIAL_CHOICES = [
		("bovino", "Desechos bovinos"),
		("porcino", "Desechos porcinos"),
		("vegetal", "Residuos vegetales"),
	]

	date = models.DateField(default=timezone.now)
	number = models.PositiveIntegerField(help_text="Número de llenado/etapa")
	people = models.CharField(max_length=255, help_text="Personas que hicieron el llenado")
	material_type = models.CharField(max_length=20, choices=MATERIAL_CHOICES)
	material_amount_kg = models.FloatField()
	material_humidity_pct = models.FloatField()
	added_water_m3 = models.FloatField(default=0.0)
	temperature_c = models.FloatField(default=35.0)
	active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self):
		return f"Llenado #{self.number} ({self.material_type}) - {self.date}"


class SensorReading(models.Model):
	stage = models.ForeignKey(FillingStage, on_delete=models.CASCADE, related_name="readings")
	timestamp = models.DateTimeField(default=timezone.now, db_index=True)
	pressure_hpa = models.FloatField(null=True, blank=True)
	biol_flow = models.FloatField(null=True, blank=True, help_text="Caudal biol (unidades del sensor)")
	gas_flow = models.FloatField(null=True, blank=True, help_text="Caudal gas (unidades del sensor)")
	raw_payload = models.JSONField(null=True, blank=True)

	class Meta:
		indexes = [
			models.Index(fields=["timestamp"]),
			models.Index(fields=["stage", "timestamp"]),
		]

	def __str__(self):
		return f"{self.timestamp} stage={self.stage_id}"

	def save(self, *args, **kwargs):
		if self.stage and not self.stage.active:
			raise Exception("No se pueden guardar lecturas en una etapa cerrada.")
		super().save(*args, **kwargs)
