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

import csv
import io
import re
from decimal import Decimal

from dateutil import parser
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.cache import cache
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.generic import TemplateView, FormView

from roundabout.cruises.models import Cruise, Vessel
from roundabout.assemblies.models import Assembly
from roundabout.configs_constants.models import ConfigDefault
from roundabout.builds.models import Build
from roundabout.locations.models import Location
from roundabout.inventory.models import Inventory, Action, Deployment, InventoryDeployment
from roundabout.inventory.utils import _create_action_history
from .forms import ImportDeploymentsForm, ImportVesselsForm, ImportCruisesForm, ImportCalibrationForm
from .models import *
from .tasks import parse_cal_files, parse_cruise_files, parse_vessel_files, parse_deployment_files
# Get the app label names from the core utility functions
from roundabout.core.utils import set_app_labels
labels = set_app_labels()

# Github CSV file importer for Vessels
class ImportVesselsUploadView(LoginRequiredMixin, FormView):
    form_class = ImportVesselsForm
    template_name = 'ooi_ci_tools/import_vessels_upload_form.html'

    def form_valid(self, form):
        csv_file = self.request.FILES['vessels_csv']
        # Set up the Django file object for CSV DictReader
        csv_file.seek(0)
        reader = csv.DictReader(io.StringIO(csv_file.read().decode('utf-8')))
        # Get the column headers to save with parent TempImport object
        headers = reader.fieldnames
        # Set up data lists for returning results
        vessels_created = []
        vessels_updated = []

        for row in reader:
            vessel_name = row['Vessel Name']
            MMSI_number = None
            IMO_number = None
            length = None
            max_speed = None
            max_draft = None
            active = re.sub(r'[()]', '', row['Active'])
            R2R = row['R2R']

            if row['MMSI#']:
                MMSI_number = int(re.sub('[^0-9]','', row['MMSI#']))

            if row['IMO#']:
                IMO_number = int(re.sub('[^0-9]','', row['IMO#']))

            if row['Length (m)']:
                length = Decimal(row['Length (m)'])

            if row['Max Speed (m/s)']:
                max_speed = Decimal(row['Max Speed (m/s)'])

            if row['Max Draft (m)']:
                max_draft = Decimal(row['Max Draft (m)'])

            if active:
                if active == 'Y':
                    active = True
                else:
                    active = False
            if R2R:
                if R2R == 'Y':
                    R2R = True
                else:
                    R2R = False

            # update or create Vessel object based on vessel_name field
            vessel_obj, created = Vessel.objects.update_or_create(
                vessel_name = vessel_name,
                defaults = {
                    'prefix': row['Prefix'],
                    'vessel_designation': row['Vessel Designation'],
                    'ICES_code': row['ICES Code'],
                    'operator': row['Operator'],
                    'call_sign': row['Call Sign'],
                    'MMSI_number': MMSI_number,
                    'IMO_number': IMO_number,
                    'length': length,
                    'max_speed': max_speed,
                    'max_draft': max_draft,
                    'designation': row['Designation'],
                    'active': active,
                    'R2R': R2R,
                },
            )

            if created:
                vessels_created.append(vessel_obj)
            else:
                vessels_updated.append(vessel_obj)

        return super(ImportVesselsUploadView, self).form_valid(form)

    def get_success_url(self):
        return reverse('ooi_ci_tools:import_upload_success', )


# Github CSV file importer for Cruises
# If no matching Vessel in RDB based on vessel_name, one will be created
class ImportCruisesUploadView(LoginRequiredMixin, FormView):
    form_class = ImportCruisesForm
    template_name = 'ooi_ci_tools/import_cruises_upload_form.html'

    def form_valid(self, form):
        csv_file = self.request.FILES['cruises_csv']
        # Set up the Django file object for CSV DictReader
        csv_file.seek(0)
        reader = csv.DictReader(io.StringIO(csv_file.read().decode('utf-8')))
        # Get the column headers to save with parent TempImport object
        headers = reader.fieldnames
        # Set up data lists for returning results
        cruises_created = []
        cruises_updated = []

        for row in reader:
            cuid = row['CUID']
            cruise_start_date = parser.parse(row['cruiseStartDateTime'])
            cruise_stop_date = parser.parse(row['cruiseStopDateTime'])
            vessel_obj = None
            # parse out the vessel name to match its formatting from Vessel CSV
            vessel_name_csv = row['ShipName'].strip()
            if vessel_name_csv == 'N/A':
                vessel_name_csv = None

            if vessel_name_csv:
                vessels = Vessel.objects.all()
                for vessel in vessels:
                    if vessel.full_vessel_name == vessel_name_csv:
                        vessel_obj = vessel
                        break
                # Create new Vessel obj if missing
                if not vessel_obj:
                    vessel_obj = Vessel.objects.create(vessel_name = vessel_name_csv)

            # update or create Cruise object based on CUID field
            cruise_obj, created = Cruise.objects.update_or_create(
                CUID = cuid,
                defaults = {
                    'notes': row['notes'],
                    'cruise_start_date': cruise_start_date,
                    'cruise_stop_date': cruise_stop_date,
                    'vessel': vessel_obj,
                },
            )

            if created:
                cruises_created.append(cruise_obj)
            else:
                cruises_updated.append(cruise_obj)

        return super(ImportCruisesUploadView, self).form_valid(form)

    def get_success_url(self):
        return reverse('ooi_ci_tools:import_upload_success', )


# Github CSV file importer for Deployments
# Ths will create a new Asembly Revision and Build for each Deployment
class ImportDeploymentsUploadView(LoginRequiredMixin, FormView):
    form_class = ImportDeploymentsForm
    template_name = 'ooi_ci_tools/import_deployments_upload_form.html'

    def form_valid(self, form):
        csv_files = self.request.FILES.getlist('deployments_csv')
        # Set up the Django file object for CSV DictReader
        for csv_file in csv_files:
            print(csv_file)
            csv_file.seek(0)
            reader = csv.DictReader(io.StringIO(csv_file.read().decode('utf-8')))
            headers = reader.fieldnames
            deployments = []
            for row in reader:
                if not any(dict['mooring.uid'] == row['mooring.uid'] for dict in deployments):
                    # get Assembly number from RefDes as that seems to be most consistent across CSVs
                    ref_des = row['Reference Designator']
                    assembly = ref_des.split('-')[0]
                    # build data dict
                    mooring_uid_dict = {'mooring.uid': row['mooring.uid'], 'assembly': assembly, 'rows': []}
                    deployments.append(mooring_uid_dict)

                deployment = next((deployment for deployment in deployments if deployment['mooring.uid'] == row['mooring.uid']), False)
                deployment['rows'].append(row)

            for deployment in deployments:
                # get the Assembly template for this Build, needs to be only one match
                try:
                    assembly = Assembly.objects.get(assembly_number=deployment['assembly'])
                    assembly_revision = assembly.assembly_revisions.latest()
                except Assembly.DoesNotExist:
                    raise ValueError("No results")
                except Assembly.MultipleObjectsReturned:
                    raise ValueError("Too many results")

                # set up common variables for Builds/Deployments
                location_code = deployment['assembly'][0:2]

                try:
                    deployed_location = Location.objects.get(location_code=location_code)
                except Location.DoesNotExist:
                    raise ValueError("No Location Matching this Location Code")

                dep_start_date = parser.parse(deployment['rows'][0]['startDateTime'])

                try:
                    dep_end_date = parser.parse(deployment['rows'][0]['stopDateTime'])
                except:
                    dep_end_date = None

                try:
                    cruise_deployed = Cruise.objects.get(CUID=deployment['rows'][0]['CUID_Deploy'])
                except Cruise.DoesNotExist:
                    raise ValueError("No Cruise matches this CUID")

                try:
                    cruise_recovered = Cruise.objects.get(CUID=deployment['rows'][0]['CUID_Recover'])
                except:
                    cruise_recovered = None

                # Set Build location dependiing on Deployment status
                if dep_end_date:
                    build_location = Location.objects.get(name='Retired')
                else:
                    build_location = deployed_location

                latitude = deployment['rows'][0]['lat']
                longitude = deployment['rows'][0]['lon']
                water_depth = deployment['rows'][0]['water_depth']

                # Get/Create a Build for this Deployment
                build, build_created = Build.objects.get_or_create(
                    build_number=deployment['mooring.uid'],
                    defaults={
                        'assembly': assembly,
                        'assembly_revision': assembly_revision,
                        'created_at': dep_start_date,
                        'location': build_location,
                    },
                )

                # Call the function to create an initial Action history
                if build_created:
                    _create_action_history(build, Action.ADD, self.request.user, '', '', dep_start_date)

                # Update/Create Deployment for this Build
                deployment_obj, deployment_created = Deployment.objects.update_or_create(
                    deployment_number=deployment['mooring.uid'],
                    defaults={
                        'build': build,
                        'deployment_start_date': dep_start_date,
                        'deployment_burnin_date': dep_start_date,
                        'deployment_to_field_date': dep_start_date,
                        'deployment_recovery_date': None,
                        'deployment_retire_date': None,
                        'deployed_location': deployed_location,
                        'cruise_deployed': cruise_deployed,
                        'cruise_recovered': cruise_recovered,
                        'latitude': latitude,
                        'longitude': longitude,
                        'depth': water_depth,
                    },
                )

                # If this an update to existing Deployment, need to delete all previous Deployment History Actions
                if not deployment_created:
                    deployment_actions = deployment_obj.actions.all()
                    deployment_actions.delete()

                print(build)
                print(deployment_obj)
                # Create Build Action records for deployment
                build.is_deployed = True
                build.save()
                deploy_actions = [Action.STARTDEPLOYMENT, Action.DEPLOYMENTBURNIN, Action.DEPLOYMENTTOFIELD]
                for action in deploy_actions:
                    _create_action_history(build, action, self.request.user, '', '', dep_start_date)

                if dep_end_date:
                    build.is_deployed = False
                    build.save()
                    deployment_obj.deployment_recovery_date = dep_end_date
                    deployment_obj.deployment_retire_date = dep_end_date
                    deployment_obj.save()

                    recover_actions = [Action.DEPLOYMENTRECOVER, Action.DEPLOYMENTRETIRE]
                    for action in recover_actions:
                        _create_action_history(build, action, self.request.user, '', '', dep_end_date)

                for row in deployment['rows']:
                    # create InventoryDeployments for each item
                    if row['sensor.uid']:
                        # Find the AssemblyPart that matches this RefDes by searching the ConfigDefault values
                        # If no match, throw error.
                        try:
                            ref_des = row['Reference Designator']
                            config_default = ConfigDefault.objects.get(default_value=ref_des)
                            print(config_default)
                            assembly_part = config_default.conf_def_event.assembly_part
                            print(assembly_part)
                        except Exception as e:
                            print(e)
                            continue

                        # Get/Create Inventory item with matching serial_number
                        item, item_created = Inventory.objects.get_or_create(
                            serial_number=row['sensor.uid'],
                            defaults={
                                'location': build_location,
                                'build': build,
                                'part': assembly_part.part,
                                'revision': assembly_part.part.revision.latest(),
                                'created_at': dep_start_date,
                            },
                        )
                        # Call the function to create an initial Action history
                        if item_created:
                            _create_action_history(item, Action.ADD, self.request.user, '', '', dep_start_date)

                        # Get/Create Deployment for this Build
                        inv_deployment_obj, inv_deployment_created = InventoryDeployment.objects.update_or_create(
                            inventory=item,
                            deployment=deployment,
                            defaults={
                                'assembly_part': assembly_part,
                                'deployment_start_date': dep_start_date,
                                'deployment_burnin_date': dep_start_date,
                                'deployment_to_field_date': dep_start_date,
                                'deployment_recovery_date': dep_end_date,
                                'deployment_retire_date': dep_end_date,
                                'deployed_location': deployed_location,
                                'cruise_deployed': cruise_deployed,
                                'cruise_recovered': cruise_recovered,
                                'item_depth': depth,
                            },
                        )

                        # _create_action_history function won't work correctly fo Inventory Deployments if item is already in RDB,
                        # need to add history Actions manually
                        inv_actions = [
                            Action.ADDTOBUILD,
                            Action.REMOVEFROMBUILD,
                        ]

                        inv_deployment_actions = [
                            Action.STARTDEPLOYMENT,
                            Action.DEPLOYMENTBURNIN,
                            Action.DEPLOYMENTTOFIELD,
                            Action.DEPLOYMENTRECOVER,
                            Action.DEPLOYMENTRETIRE,
                        ]

                        for action in inv_actions:
                            if action = Action.ADDTOBUILD:
                                action_date = dep_start_date
                                detail = 'Moved to %s.' % (build)

                            elif action = Action.REMOVEFROMBUILD and dep_end_date:
                                action_date = dep_end_date
                                detail = 'Removed from %s.' % (build)

                            action = Action.objects.create(
                                action_type = action,
                                object_type = Action.INVENTORY,
                                created_at = action_date,
                                inventory = item,
                                build = build,
                                location = deployed_location,
                                user = self.request.user,
                                detail = detail,
                            )

                        for action in inv_deployment_actions:
                            if action = Action.STARTDEPLOYMENT:
                                action_date = dep_start_date
                                detail = '%s %s started.' % (labels['label_deployments_app_singular'], deployment_obj)

                            elif action = Action.DEPLOYMENTBURNIN:
                                action_date = dep_start_date
                                detail = '%s %s burn in.' % (labels['label_deployments_app_singular'], deployment_obj)

                            elif action = Action.DEPLOYMENTTOFIELD:
                                action_date = dep_start_date
                                detail = 'Deployed to field on %s.' % (labels['label_deployments_app_singular'], deployment_obj)

                            elif action = Action.DEPLOYMENTRECOVER and dep_end_date:
                                action_date = dep_end_date
                                detail = 'Recovered from %s.' % (labels['label_deployments_app_singular'], deployment_obj)

                            elif action = Action.DEPLOYMENTRETIRE and dep_end_date:
                                action_date = dep_end_date
                                detail = '%s %s ended for this %s.' % (labels['label_deployments_app_singular'], deployment_obj, labels['label_inventory_app_singular'])

                            action = Action.objects.create(
                                action_type = action,
                                object_type = Action.INVENTORY,
                                created_at = action_date,
                                inventory = item,
                                build = build,
                                location = deployed_location,
                                deployment = deployment_obj,
                                inventory_deployment = inventory_deployment_obj,
                                deployment_type = Action.INVENTORY_DEPLOYMENT,
                                user = self.request.user,
                                detail = detail,
                            )

                        print(row['sensor.uid'])

        return super(ImportDeploymentsUploadView, self).form_valid(form)

    def get_success_url(self):
        return reverse('ooi_ci_tools:import_upload_success', )


class ImportUploadSuccessView(TemplateView):
    template_name = "ooi_ci_tools/import_upload_success.html"


def upload_status(request):
    # import_task = cache.get('import_task')
    # if import_task is None:
    #     return JsonResponse({ 'state': 'PENDING' })
    # async_result = AsyncResult(import_task)
    # info = getattr(async_result, 'info', '');
    result = cache.get('validation_progress')
    cache.delete('validation_progress')
    return JsonResponse({
        'progress': result,
    })

# Deployment CSV Importer
def import_deployments(csv_files):
    cache.set('dep_files',csv_files, timeout=None)
    job = parse_deployment_files.delay()


# Cruise CSV Importer
def import_cruises(cruises_files):
    cache.set('cruises_files', cruises_files, timeout=None)
    job = parse_cruise_files.delay()

# Vessel CSV Importer
def import_vessels(vessels_files):
    cache.set('vessels_files', vessels_files, timeout=None)
    job = parse_vessel_files.delay()

# Calibration CSV Importer
def import_calibrations(cal_files, user, user_draft):
    csv_files = []
    ext_files = []
    for file in cal_files:
        ext = file.name[-3:]
        if ext == 'ext':
            ext_files.append(file)
        if ext == 'csv':
            csv_files.append(file)
    cache.set('user', user, timeout=None)
    cache.set('user_draft', user_draft, timeout=None)
    cache.set('ext_files', ext_files, timeout=None)
    cache.set('csv_files', csv_files, timeout=None)
    job = parse_cal_files.delay()
    cache.set('import_task', job.task_id, timeout=None)

# CSV Importer View
# Activates parsing tasks based on selected files
def import_csv(request):
    confirm = ""
    if request.method == "POST":
        cal_form = ImportCalibrationForm(request.POST, request.FILES)
        dep_form = ImportDeploymentsForm(request.POST, request.FILES)
        cruises_form = ImportCruisesForm(request.POST, request.FILES)
        vessels_form = ImportVesselsForm(request.POST, request.FILES)
        cal_files = request.FILES.getlist('calibration_csv')
        dep_files = request.FILES.getlist('deployments_csv')
        cruises_file = request.FILES.getlist('cruises_csv')
        vessels_file = request.FILES.getlist('vessels_csv')
        if cal_form.is_valid() and len(cal_files) >= 1:
            import_calibrations(cal_files, request.user, cal_form.cleaned_data['user_draft'])
            confirm = "True"
        if dep_form.is_valid() and len(dep_files) >= 1:
            import_deployments(dep_files)
            confirm = "True"
        if cruises_form.is_valid() and len(cruises_file) >= 1:
            import_cruises(cruises_file)
            confirm = "True"
        if vessels_form.is_valid() and len(vessels_file) >= 1:
            import_vessels(vessels_file)
            confirm = "True"
    else:
        cal_form = ImportCalibrationForm()
        dep_form = ImportDeploymentsForm()
        cruises_form = ImportCruisesForm()
        vessels_form = ImportVesselsForm()
    return render(request, 'ooi_ci_tools/import_tool.html', {
        "form": cal_form,
        'dep_form': dep_form,
        'cruises_form': cruises_form,
        'vessels_form': vessels_form,
        'confirm': confirm
    })
