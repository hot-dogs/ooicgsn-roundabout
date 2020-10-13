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

# Generated by Django 2.2.4 on 2019-10-23 17:35
"""
Auto-generate default Part Types for start up
"""
from django.db import migrations
from django.apps import apps


def create_part_types(apps, schema_editor):
    PartType = apps.get_model('parts', 'PartType')
    part_types = ['Cable', 'Electrical', 'Instrument', 'Mechanical']

    for part_type in part_types:
        obj, created = PartType.objects.get_or_create(name=part_type)


class Migration(migrations.Migration):

    dependencies = [
        ('parts', '0003_auto_20191023_1408'),
    ]

    operations = [
        migrations.RunPython(create_part_types),
    ]
