# Generated by Django 2.0.12 on 2019-05-16 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userdefinedfields', '0007_auto_20190515_1601'),
    ]

    operations = [
        migrations.AddField(
            model_name='field',
            name='value_is_locked',
            field=models.BooleanField(default=False),
        ),
    ]