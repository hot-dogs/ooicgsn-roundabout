# Generated by Django 3.1.3 on 2021-02-03 20:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ooi_ci_tools', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['created_at']},
        ),
    ]
