from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_perfil_rol_alter_perfil_permisos'),
    ]

    operations = [
        migrations.AddField(
            model_name='permisos',
            name='VerCalibraciones',
            field=models.BooleanField(default=False),
        ),
    ]
