# Generated by Django 2.2.9 on 2020-04-15 15:32

from django.db import migrations, models
import roundabout.calibrations.models


class Migration(migrations.Migration):

    dependencies = [
        ('calibrations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coefficientvalue',
            name='value',
            field=models.CharField(max_length=20, validators=[roundabout.calibrations.models.validate_coeff_val]),
        ),
    ]
