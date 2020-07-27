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
import csv,zipfile,io
from os.path import splitext

from django.views.generic import TemplateView, DetailView, ListView
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin

from roundabout.calibrations.models import CalibrationEvent

class HomeView(TemplateView):
    template_name = 'exports/home.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # add stuff
        return context

class ExportCalibrationEvent(DetailView,LoginRequiredMixin):
    model = CalibrationEvent
    context_object_name = 'cal_event'

    def render_to_response(self, context, **response_kwargs):
        cal = context.get(self.context_object_name)  # getting object from context
        fname = 'CGINS-{}-{:05}__{}.csv'.format(cal.inventory.part.name.replace('-',''),
                                                int(cal.inventory.old_serial_number),
                                                cal.calibration_date.strftime('%Y%m%d'))

        serial_label = cal.inventory.old_serial_number or cal.inventory.serial_number
        prefix_qs = cal.inventory.fieldvalues.filter(field__field_name__iexact='Calibration Export Prefix',is_current=True)
        if prefix_qs.exists():
            serial_label = prefix_qs[0].field_value+serial_label
        elif 'OPTAA' in cal.inventory.part.name:
            serial_label = 'ACS-'+serial_label

        # TODO: should this live in calibrations/models as eg an export() function?
        zip_mode = []
        header = ['serial','name','value','notes']
        rows = [header]
        for coeff in cal.coefficient_value_sets.all():
            if coeff.coefficient_name.value_set_type == '2d':
                extra = ('{}__{}.ext'.format(splitext(fname)[0], coeff.coefficient_name),
                         coeff.value_set)
                zip_mode.append(extra)

            row = [serial_label,
                   coeff.coefficient_name.calibration_name,
                   coeff.value_set_with_export_formatting(),
                   coeff.notes]
            rows.append(row)

        if zip_mode:
            response = HttpResponse(content_type='application/zip')
            fname_zip = '{}.zip'.format(splitext(fname)[0])
            response['Content-Disposition'] = 'inline; filename="{}"'.format(fname_zip)
            zf = zipfile.ZipFile(response, 'w')
            csv_content = io.StringIO()
            writer = csv.writer(csv_content)
            writer.writerows(rows)
            zf.writestr(fname,csv_content.getvalue())
            for extra_fname,extra_content in zip_mode:
                zf.writestr(extra_fname, extra_content)
            return response

        else:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'inline; filename="{}"'.format(fname)
            writer = csv.writer(response)
            writer.writerows(rows)
            return response

class ZipExport(ListView,LoginRequiredMixin):
    model=None
    fname_zip = '{}.zip'.format(model)
    context_object_name = 'objs'

    def build_zip(self, zf, objs):
        pass

    def render_to_response(self, context, **response_kwargs):
        response = HttpResponse(content_type='application/zip')
        response['Content-Disposition'] = 'inline; filename="{}"'.format(self.fname_zip)
        objs = context.get(self.context_object_name)
        zf = zipfile.ZipFile(response, 'w')
        print(objs)
        self.build_zip(zf, objs)
        return response


class ExportCalibrationEvents(ZipExport):
    model = CalibrationEvent
    fname_zip = 'CalibrationEvents.zip'

    def build_zip(self, zf, objs):
        for cal in objs:
            fname = 'CGINS-{}-{:05}__{}.csv'.format(cal.inventory.part.name.replace('-', ''),
                    int(cal.inventory.old_serial_number), cal.calibration_date.strftime('%Y%m%d'))

            serial_label = cal.inventory.old_serial_number or cal.inventory.serial_number
            prefix_qs = cal.inventory.fieldvalues.filter(field__field_name__iexact='Calibration Export Prefix', is_current=True)
            if prefix_qs.exists():
                serial_label = prefix_qs[0].field_value+serial_label
            elif 'OPTAA' in cal.inventory.part.name:
                serial_label = 'ACS-'+serial_label

            aux_files = []
            header = ['serial', 'name', 'value', 'notes']
            rows = [header]
            for coeff in cal.coefficient_value_sets.all():
                if coeff.coefficient_name.value_set_type == '2d':
                    extra = ('{}__{}.ext'.format(splitext(fname)[0], coeff.coefficient_name),
                             coeff.value_set)
                    aux_files.append(extra)

                row = [serial_label,
                       coeff.coefficient_name.calibration_name,
                       coeff.value_set_with_export_formatting(),
                       coeff.notes]
                rows.append(row)

            csv_content = io.StringIO()
            writer = csv.writer(csv_content)
            writer.writerows(rows)
            zf.writestr(fname, csv_content.getvalue())
            for extra_fname, extra_content in aux_files:
                zf.writestr(extra_fname, extra_content)
