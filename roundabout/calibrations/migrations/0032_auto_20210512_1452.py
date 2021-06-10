# Generated by Django 3.1.3 on 2021-05-12 14:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('inventory', '0068_auto_20210512_1446'),
        ('assemblies', '0011_auto_20201117_2030'),
        ('parts', '0017_merge_20210209_1909'),
        ('calibrations', '0031_coefficientnameevent_deployment'),
    ]

    operations = [
        migrations.AddField(
            model_name='calibrationevent',
            name='assembly_part',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assemblypart_calibrationevents', to='assemblies.assemblypart'),
        ),
        migrations.AddField(
            model_name='calibrationevent',
            name='part',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='part_calibrationevents', to='parts.part'),
        ),
        migrations.AlterField(
            model_name='calibrationevent',
            name='deployment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='deployment_calibrationevents', to='inventory.deployment'),
        ),
        migrations.AlterField(
            model_name='calibrationevent',
            name='inventory',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inventory_calibrationevents', to='inventory.inventory'),
        ),
        migrations.AlterField(
            model_name='calibrationevent',
            name='user_approver',
            field=models.ManyToManyField(related_name='approver_calibrationevents', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='calibrationevent',
            name='user_draft',
            field=models.ManyToManyField(blank=True, related_name='reviewer_calibrationevents', to=settings.AUTH_USER_MODEL),
        ),
    ]