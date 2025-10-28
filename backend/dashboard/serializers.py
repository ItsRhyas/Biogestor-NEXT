from rest_framework import serializers
from .models import Report, FillingStage, SensorReading

class ReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    class Meta:
        model = Report
        fields = ['id', 'created_at', 'user', 'user_name', 'report_type', 'observations', 'inferences', 'production_estimated', 'production_real', 'file_pdf', 'file_excel', 'file_csv', 'stage']

class FillingStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillingStage
        fields = '__all__'

class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields = '__all__'

# Reporte para historial
class ReportHistorySerializer(serializers.ModelSerializer):
    last_reading = serializers.DateTimeField(source='readings.last.timestamp', read_only=True)
    finalizado = serializers.SerializerMethodField()
    class Meta:
        model = FillingStage
        fields = ['id', 'number', 'date', 'material_type', 'material_amount_kg', 'temperature_c', 'active', 'finalizado', 'last_reading']
    def get_finalizado(self, obj):
        return not obj.active
