# Generated by Django 2.0.12 on 2019-04-26 15:34

from django.db import migrations

def port_inventory_to_revisions(apps, schema_editor):
    # We can't import the model directly as it may be a newer
    # version than this migration expects. We use the historical version.

    Inventory = apps.get_model('inventory', 'Inventory')

    # Set initial Revision for existing Inventory items
    for inv in Inventory.objects.all():
        if inv.part:
            inv.revision = inv.part.revisions.all().first()
        else:
            inv.revision = None
        inv.save()


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0052_inventory_revision'),
    ]

    operations = [
        migrations.RunPython(port_inventory_to_revisions),
    ]