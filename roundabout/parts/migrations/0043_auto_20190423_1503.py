# Generated by Django 2.0.12 on 2019-04-23 15:03

from django.db import migrations

def port_old_parts_to_revisions(apps, schema_editor):
    # We can't import the model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    Part = apps.get_model('parts', 'Part')
    Revision = apps.get_model('parts', 'Revision')
    Documentation = apps.get_model('parts', 'Documentation')

    for part in Part.objects.all():
        if part.revision:
            revision_code = part.revision
        else:
            revision_code = 'A'
        rev = Revision.objects.create(part=part, revision_code=revision_code, unit_cost=part.unit_cost, refurbishment_cost=part.refurbishment_cost, note=part.note)

    for part in Part.objects.all():
        for doc in part.documentation.all():
            doc.revision = part.revisions.all().first()
            doc.save()

class Migration(migrations.Migration):

    dependencies = [
        ('parts', '0042_documentation_revision'),
    ]

    operations = [
        migrations.RunPython(port_old_parts_to_revisions),
    ]
