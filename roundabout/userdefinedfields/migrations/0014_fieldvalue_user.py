# Generated by Django 2.0.12 on 2019-05-23 13:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('userdefinedfields', '0013_auto_20190522_1944'),
    ]

    operations = [
        migrations.AddField(
            model_name='fieldvalue',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='fieldvalues', to=settings.AUTH_USER_MODEL),
        ),
    ]
