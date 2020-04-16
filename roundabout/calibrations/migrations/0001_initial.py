# Generated by Django 2.2.9 on 2020-04-13 19:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('parts', '0006_auto_20200406_1347'),
        ('inventory', '0003_auto_20191023_1347'),
    ]

    operations = [
        migrations.CreateModel(
            name='CalibrationEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('calibration_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('approved', models.BooleanField(choices=[(True, 'Approved'), (False, 'Draft')], default=False)),
                ('deployment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='calibration_events', to='inventory.Deployment')),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='calibration_events', to='inventory.Inventory')),
                ('user_approver', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='calibration_events_approver', to=settings.AUTH_USER_MODEL)),
                ('user_draft', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='calibration_events_drafter', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-calibration_date'],
            },
        ),
        migrations.CreateModel(
            name='CoefficientName',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('calibration_name', models.CharField(db_index=True, max_length=255)),
                ('part', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coefficient_names', to='parts.Part')),
            ],
            options={
                'ordering': ['calibration_name'],
            },
        ),
        migrations.CreateModel(
            name='CoefficientValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=20)),
                ('notes', models.TextField(blank=True)),
                ('notation_format', models.CharField(choices=[('sci', 'Scientific'), ('eng', 'Engineering'), ('std', 'Standard')], default='std', max_length=3)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('calibration_event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coefficient_values', to='calibrations.CalibrationEvent')),
                ('coefficient_name', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coefficient_values', to='calibrations.CoefficientName')),
            ],
        ),
    ]
