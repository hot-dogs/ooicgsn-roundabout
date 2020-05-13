# Generated by Django 2.2.9 on 2020-02-19 15:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0006_auto_20200218_1618'),
    ]

    operations = [
        migrations.AddField(
            model_name='assemblypart',
            name='assembly_revision',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assembly_parts', to='assemblies.AssemblyRevision'),
        ),
    ]