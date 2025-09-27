from django.db import models

class Feedstock(models.Model):
    """A library of digestible materials (e.g., Cow Manure). Pre-populated by you, the admin."""
    name = models.CharField(max_length=100)
    total_solids = models.FloatField(help_text="TS (%)")  # e.g., 18.0
    volatile_solids = models.FloatField(help_text="VS (% of TS)")  # e.g., 80.0
    cn_ratio = models.FloatField(null=True, blank=True, help_text="C:N Ratio (optional)")
    # Biogenic potential: if null, the general default will be used in calculations.
    biogas_yield = models.FloatField(null=True, blank=True, help_text="m³ Biogas per kg VS")

    def __str__(self):
        return self.name

class Calculation(models.Model):
    """Represents one user's calculation scenario."""
    name = models.CharField(max_length=100, default="New Calculation")
    # User-adjustable parameters ("Threatened Variables")
    retention_time = models.FloatField(default=30, help_text="Hydraulic Retention Time (days)")
    water_ratio = models.FloatField(default=1.0, help_text="Water:Feedstock ratio (e.g., 1.0 for 1:1)")
    temperature = models.FloatField(default=35.0, help_text="Digester temperature (°C)")
    created = models.DateTimeField(auto_now_add=True)
    
    # Results (calculated and stored)
    total_biogas = models.FloatField(null=True, blank=True)  # m³/day
    total_slurry = models.FloatField(null=True, blank=True)  # kg/day
    required_volume = models.FloatField(null=True, blank=True) # m³

    def __str__(self):
        return f"{self.name} (ID: {self.id})"

class RecipeItem(models.Model):
    """Links a Feedstock and its daily amount to a Calculation."""
    calculation = models.ForeignKey(Calculation, on_delete=models.CASCADE, related_name='ingredients')
    feedstock = models.ForeignKey(Feedstock, on_delete=models.CASCADE)
    daily_amount = models.FloatField(help_text="kg/day")  # The key user input per feedstock

    class Meta:
        unique_together = ['calculation', 'feedstock']  # Prevent duplicates

    def __str__(self):
        return f"{self.daily_amount} kg/day of {self.feedstock.name}"