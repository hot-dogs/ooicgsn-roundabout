# Generated by Django 2.0.12 on 2019-04-16 16:25

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('parts', '0038_auto_20190320_1425'),
    ]

    operations = [
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('revision_code', models.CharField(db_index=True, max_length=255)),
                ('unit_cost', models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=9, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('refurbishment_cost', models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=9, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('note', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['revision_code'],
            },
        ),
    ]
