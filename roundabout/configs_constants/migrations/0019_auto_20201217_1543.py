# Generated by Django 3.1.3 on 2020-12-17 15:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configs_constants', '0018_configname_deprecated'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='configname',
            options={'ordering': ['created_at']},
        ),
    ]
