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
import json
import re
import requests
from dateutil import parser
import datetime
from types import SimpleNamespace
from decimal import Decimal

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse, reverse_lazy
from django.views.generic import View, DetailView, ListView, RedirectView, UpdateView, CreateView, DeleteView, TemplateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from celery.result import AsyncResult


from .forms import ImportDeploymentsForm, ImportVesselsForm, ImportCruisesForm, ImportCalibrationForm
from .models import *
from .tasks import parse_cal_files

from roundabout.userdefinedfields.models import FieldValue, Field
from roundabout.inventory.models import Inventory, Action
from roundabout.parts.models import Part, Revision, Documentation, PartType
from roundabout.assemblies.models import AssemblyType, Assembly, AssemblyPart, AssemblyRevision
from roundabout.inventory.utils import _create_action_history
from roundabout.calibrations.models import CoefficientName, CoefficientValueSet, CalibrationEvent
from roundabout.calibrations.forms import validate_coeff_vals, parse_valid_coeff_vals
from roundabout.users.models import User
from roundabout.cruises.models import Cruise, Vessel


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
                max_speed = Decimal(row['Max Draft (m)'])

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
            cruise_start_date = parser.parse(row['cruiseStartDateTime']).date()
            cruise_stop_date = parser.parse(row['cruiseStopDateTime']).date()
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
                if row['mooring.uid'] not in deployments:
                    # get Assembly number from RefDes as that seems to be most consistent across CSVs
                    ref_des = row['Reference Designator']
                    assembly = ref_des.split('-')[0]
                    # build data dict
                    mooring_uid_dict = {'mooring.uid': row['mooring.uid'], 'assembly': assembly, 'rows': []}
                    deployments.append(mooring_uid_dict)

                deployment = next((deployment for deployment in deployments if deployment['mooring.uid']== row['mooring.uid']), False)
                for key, value in row.items():
                    deployment['rows'].append({key: value})

            print(deployments[0])
            for row in deployments[0]['rows']:
                print(row)

        return super(ImportDeploymentsUploadView, self).form_valid(form)

    def get_success_url(self):
        return reverse('ooi_ci_tools:import_upload_success', )


class ImportUploadSuccessView(TemplateView):
    template_name = "ooi_ci_tools/import_upload_success.html"


# CSV File Uploader for GitHub Calibration Coefficients
class ImportCalibrationsUploadView(LoginRequiredMixin, FormView):
    form_class = ImportCalibrationForm
    template_name = 'ooi_ci_tools/import_calibrations_upload_form.html'


    def form_valid(self, form):
        cal_files = self.request.FILES.getlist('cal_csv')
        csv_files = []
        ext_files = []
        for file in cal_files:
            ext = file.name[-3:]
            if ext == 'ext':
                ext_files.append(file)
            if ext == 'csv':
                csv_files.append(file)
        cache.set('user', self.request.user, timeout=None)
        cache.set('user_draft', form.cleaned_data['user_draft'], timeout=None)
        cache.set('ext_files', ext_files, timeout=None)
        cache.set('csv_files', csv_files, timeout=None)
        job = parse_cal_files.delay()
        cache.set('import_task', job.task_id, timeout=None)
        return super(ImportCalibrationsUploadView, self).form_valid(form)

    def get_success_url(self):
        return reverse('ooi_ci_tools:import_upload_success', )


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

def import_calibrations(request):
    confirm = ""
    if request.method == "POST":
        form = ImportCalibrationForm(request.POST, request.FILES)
        if form.is_valid():
            cal_files = request.FILES.getlist('cal_csv')
            csv_files = []
            ext_files = []
            for file in cal_files:
                ext = file.name[-3:]
                if ext == 'ext':
                    ext_files.append(file)
                if ext == 'csv':
                    csv_files.append(file)
            cache.set('user', request.user, timeout=None)
            cache.set('user_draft', form.cleaned_data['user_draft'], timeout=None)
            cache.set('ext_files', ext_files, timeout=None)
            cache.set('csv_files', csv_files, timeout=None)
            job = parse_cal_files.delay()
            cache.set('import_task', job.task_id, timeout=None)
            return redirect(reverse("ooi_ci_tools:import_calibrations_upload") + "?confirm=True")
    else:
        form = ImportCalibrationForm()
        confirm = request.GET.get("confirm")
    return render(request, 'ooi_ci_tools/import_calibrations_upload_form.html', {
        "form": form,
        'confirm': confirm
    })