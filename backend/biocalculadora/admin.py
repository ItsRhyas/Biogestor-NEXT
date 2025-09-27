from django.contrib import admin
from biocalculadora.models import Feedstock, Calculation, RecipeItem

@admin.register(Feedstock)
class FeedstockAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_solids', 'volatile_solids', 'biogas_yield')

@admin.register(Calculation)
class CalculationAdmin(admin.ModelAdmin):
    list_display = ('name', 'retention_time', 'temperature', 'total_biogas', 'created')
    readonly_fields = ('total_biogas', 'total_slurry', 'required_volume', 'created') # Results are read-only

admin.site.register(RecipeItem)