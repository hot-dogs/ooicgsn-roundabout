# Generated by Django 2.2.10 on 2020-04-30 18:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    dependencies = [
        ('builds', '0012_auto_20200427_2056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='buildaction',
            name='build',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='build_actions', to='builds.Build'),
        ),
        migrations.AlterField(
            model_name='buildaction',
            name='location',
            field=mptt.fields.TreeForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='build_actions', to='locations.Location'),
        ),
        migrations.AlterField(
            model_name='buildaction',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='build_actions', to=settings.AUTH_USER_MODEL),
        ),
    ]
