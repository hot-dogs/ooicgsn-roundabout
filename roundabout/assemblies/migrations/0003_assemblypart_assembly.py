# Generated by Django 2.2.1 on 2019-06-18 17:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0002_auto_20190618_1410'),
    ]

    operations = [
        migrations.AddField(
            model_name='assemblypart',
            name='assembly',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='assembly_parts', to='assemblies.Assembly'),
            preserve_default=False,
        ),
    ]