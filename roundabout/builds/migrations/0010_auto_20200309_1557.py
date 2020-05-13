# Generated by Django 2.2.9 on 2020-03-09 15:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0008_auto_20200219_1611'),
        ('builds', '0009_auto_20200227_1806'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='build',
            options={'ordering': ['build_number']},
        ),
        migrations.AddField(
            model_name='build',
            name='assembly_revision',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='builds', to='assemblies.AssemblyRevision'),
        ),
    ]