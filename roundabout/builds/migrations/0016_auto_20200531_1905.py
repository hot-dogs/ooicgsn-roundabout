# Generated by Django 2.2.10 on 2020-05-31 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builds', '0015_auto_20200527_1430'),
    ]

    operations = [
        migrations.AlterField(
            model_name='buildaction',
            name='action_type',
            field=models.CharField(choices=[('buildadd', 'Add Build'), ('locationchange', 'Location Change'), ('subassemblychange', 'Subassembly Change'), ('startdeployment', 'Start Deployment'), ('removefromdeployment', 'Deployment Ended'), ('deploymentburnin', 'Deployment Burnin'), ('deploymenttofield', 'Deployment to Field'), ('deploymentupdate', 'Deployment Update'), ('deploymentrecover', 'Deployment Recovered'), ('deploymentretire', 'Deployment Retired'), ('deploymentdetails', 'Deployment Details Updated'), ('test', 'Test'), ('note', 'Note'), ('historynote', 'Historical Note'), ('ticket', 'Work Ticket'), ('flag', 'Flag'), ('retirebuild', 'Retire Build')], max_length=20),
        ),
    ]
