# Generated by Django 3.1.3 on 2021-04-22 14:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0006_auto_20201210_2044'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='location_type',
        ),
    ]
