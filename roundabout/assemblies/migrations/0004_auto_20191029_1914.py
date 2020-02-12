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

"""
Auto-generate default Assembly Types for start up
"""
from django.db import migrations
from django.apps import apps

AssemblyType = apps.get_model('assemblies', 'AssemblyType')

def create_assembly_types(apps, schema_editor):
    assembly_types = ['AUV', 'Glider', 'Mooring', 'ROV', 'HOV', 'Towed Vehicle']

    for assembly_type in assembly_types:
        obj, created = AssemblyType.objects.get_or_create(name=assembly_type)


class Migration(migrations.Migration):

    dependencies = [
        ('assemblies', '0003_auto_20191022_1758'),
    ]

    operations = [
        migrations.RunPython(create_assembly_types),
    ]
