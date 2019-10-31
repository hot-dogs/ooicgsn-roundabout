# Generated by Django 2.2.4 on 2019-10-23 14:05
"""
Auto generate necessary Groups and Permissions for Locations
Admin - all Permissions
Technician - all permissions
Inventory Only - no permissions
"""

from django.db import migrations
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.management import create_permissions

Group = apps.get_model('auth','Group')
Permission = apps.get_model('auth','Permission')

def add_group_permissions(apps, schema_editor):
    # Need to create permissions manually since this is a migration
    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, apps=apps, verbosity=0)
        app_config.models_module = None
        
    # create Admin group, add all permissions
    group, created = Group.objects.get_or_create(name='admin')
    if created or group:
        # get all models for this app
        content_type = ContentType.objects.filter(app_label='locations')
        # loop through each model for the app, get the permissions
        for c in content_type:
            permissions = Permission.objects.filter(content_type=c)
            # add permission to group
            for p in permissions:
                group.permissions.add(p)
                group.save()

    # create Technician group, add all permissions
    group, created = Group.objects.get_or_create(name='technician')
    if created or group:
        # get all models for this app
        content_type = ContentType.objects.filter(app_label='locations')
        # loop through each model for the app, get the permissions
        for c in content_type:
            permissions = Permission.objects.filter(content_type=c)
            # add permission to group
            for p in permissions:
                group.permissions.add(p)
                group.save()


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_group_permissions),
    ]
