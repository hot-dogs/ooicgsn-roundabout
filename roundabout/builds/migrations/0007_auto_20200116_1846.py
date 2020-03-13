"""
# Copyright (C) 2019-2020 Woods Hole Oceanographic Institution
#
# This file is part of the Roundabout Database project ("RDB" or 
# "ooicgsn-roundabout").
#
# ooicgsn-roundabout is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 2 of the License, or
# (at your option) any later version.
#
# ooicgsn-roundabout is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with ooicgsn-roundabout in the COPYING.md file at the project root.
# If not, see <http://www.gnu.org/licenses/>.
"""

# Generated by Django 2.2.9 on 2020-01-16 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builds', '0006_auto_20200110_1429'),
    ]

    operations = [
        migrations.AlterField(
            model_name='buildaction',
            name='action_type',
            field=models.CharField(choices=[('buildadd', 'Add Build'), ('locationchange', 'Location Change'), ('subassemblychange', 'Subassembly Change'), ('startdeploy', 'Start Deployment'), ('removefromdeployment', 'Deployment Ended'), ('deploymentburnin', 'Deployment Burnin'), ('deploymenttosea', 'Deployment to Sea'), ('deploymentupdate', 'Deployment Update'), ('deploymentrecover', 'Deployment Recovered'), ('test', 'Test'), ('note', 'Note'), ('historynote', 'Historical Note'), ('ticket', 'Work Ticket'), ('flag', 'Flag'), ('retirebuild', 'Retire Build')], max_length=20),
        ),
    ]