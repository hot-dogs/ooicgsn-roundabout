# Generated by Django 2.2.13 on 2020-09-16 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calibrations', '0020_auto_20200901_1711'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coefficientvalue',
            name='original_value',
            field=models.CharField(max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='coefficientvalue',
            name='value',
            field=models.CharField(max_length=25),
        ),
    ]