# Generated by Django 2.2.13 on 2020-08-20 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0049_auto_20200817_2123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='action_type',
            field=models.CharField(choices=[('add', 'Added to RDB'), ('update', 'Details updated'), ('locationchange', 'Location Change'), ('subchange', 'Sub-Assembly Change'), ('addtobuild', 'Add to Build'), ('removefrombuild', 'Remove from Build'), ('startdeployment', 'Start Deployment'), ('removefromdeployment', 'Deployment Ended'), ('deploymentburnin', 'Deployment Burnin'), ('deploymenttofield', 'Deployment to Field'), ('deploymentupdate', 'Deployment Update'), ('deploymentrecover', 'Deployment Recovery'), ('deploymentretire', 'Deployment Retired'), ('deploymentdetails', 'Deployment Details Updated'), ('assigndest', 'Assign Destination'), ('removedest', 'Remove Destination'), ('test', 'Test'), ('note', 'Note'), ('historynote', 'Historical Note'), ('ticket', 'Work Ticket'), ('fieldchange', 'Field Change'), ('flag', 'Flag'), ('movetotrash', 'Move to Trash'), ('retirebuild', 'Retire Build'), ('reviewapprove', 'Reviewer approved Event'), ('eventapprove', 'Event Approved'), ('calcsvimport', 'Calibration CSV Uploaded')], db_index=True, max_length=20),
        ),
    ]