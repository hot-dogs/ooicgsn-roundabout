# Generated by Django 2.0.12 on 2019-05-01 18:42

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0054_auto_20190501_1651'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deploymentaction',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=7, max_digits=10, null=True, validators=[django.core.validators.MaxValueValidator(90), django.core.validators.MinValueValidator(0)]),
        ),
    ]