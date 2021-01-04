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

import django_tables2 as tables2
from django import forms
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.utils.html import format_html
from django.views.generic import TemplateView
from django_tables2.columns import Column, DateTimeColumn, ManyToManyColumn, BooleanColumn
from django_tables2_column_shifter.tables import ColumnShiftTable

from roundabout.builds.models import BuildAction
from roundabout.calibrations.models import CalibrationEvent, CoefficientNameEvent
from roundabout.configs_constants.models import ConfigEvent, ConfigNameEvent, ConstDefaultEvent, ConfigDefaultEvent
from roundabout.inventory.models import Action, DeploymentAction
from roundabout.users.models import User
from roundabout.search.tables import trunc_render

# ========= TABLE BASES ========== #

class UserTableBase(tables2.Table):
    class Meta:
        template_name = "django_tables2/bootstrap4.html"
        attrs = {'style': 'display: block; overflow-x: auto;'}
        model = None
        title = None

class CCCUserTableBase(UserTableBase):
    class Meta(UserTableBase.Meta):
        fields = ['approved', 'user_draft', 'user_approver', 'created_at', 'detail']
    approved = BooleanColumn()
    user_approver = ManyToManyColumn(verbose_name='Approvers', accessor='user_approver', transform=lambda x: x.name, default='')
    user_draft = ManyToManyColumn(verbose_name='Reviewers', accessor='user_draft', transform=lambda x: x.name, default='')
    created_at = DateTimeColumn(verbose_name='Date Entered', accessor='created_at', format='Y-m-d H:i')
    detail = Column(verbose_name='Note', accessor='detail')
    def render_detail(self,value):
        return trunc_render()(value)

class ActionUserTableBase(UserTableBase):
    class Meta(UserTableBase.Meta):
        fields = ['action_type', 'user__name', 'created_at', 'detail']
    user__name = Column(verbose_name='User')
    def render_detail(self,value):
        return trunc_render()(value)
# ========= TABLES ========== #

## CCC Events ##

class CalibrationTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = CalibrationEvent
        title = 'Calibration Events'
        fields = ['inventory__serial_number'] + CCCUserTableBase.Meta.fields
    inventory__serial_number = Column(verbose_name='Inventory', linkify=dict(viewname="inventory:inventory_detail", args=[tables2.A('inventory__pk')]))
    value_names = ManyToManyColumn(verbose_name='Coefficient Names', accessor='coefficient_value_sets', transform=lambda x: x.coefficient_name)
    #value_notes = ManyToManyColumn(verbose_name='Coefficient Notes', accessor='coefficient_value_sets',
    #                transform=lambda x: format_html('<b>{}:</b> [{}]<br>'.format(x.coefficient_name,trunc_render()(x.notes))) if x.notes else '', separator='\n')

class ConfigConstTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = ConfigEvent
        title = 'Configuration/Constant Events'
        fields = ['inventory__serial_number'] + CCCUserTableBase.Meta.fields
    inventory__serial_number = Column(verbose_name='Inventory', linkify=dict(viewname="inventory:inventory_detail", args=[tables2.A('inventory__pk')]))
    value_names = ManyToManyColumn(verbose_name='Config/Constant Names', accessor='config_values', transform=lambda x: x.config_name)
    #value_notes = ManyToManyColumn(verbose_name='Config/Constant Notes', accessor='config_values',
    #                transform=lambda x: format_html('<b>{}:</b> [{}]<br>'.format(x.config_name,trunc_render()(x.notes))) if x.notes else '', separator='\n')


## CCC Name Events ##

class CoefficientNameEventTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = CoefficientNameEvent
        title = 'Calibration Name-Events'
        fields = ['part__name'] + CCCUserTableBase.Meta.fields
    part__name = Column(verbose_name='Part', linkify=dict(viewname="parts:parts_detail", args=[tables2.A('part__pk')]))
    value_names = ManyToManyColumn(verbose_name='Coefficient Names', accessor='coefficient_names', transform=lambda x: x.calibration_name)

class ConfigNameEventTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = ConfigNameEvent
        title = 'Configuration/Constant Name-Events'
        fields = ['part__name'] + CCCUserTableBase.Meta.fields
    part__name = Column(verbose_name='Part', linkify=dict(viewname="parts:parts_detail", args=[tables2.A('part__pk')]))
    value_names = ManyToManyColumn(verbose_name='Configuration Names', accessor='config_names', transform=lambda x: x.name)


## CCC Default Events ##

class ConfigDefaultEventTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = ConfigDefaultEvent
        title = 'Configuration Default-Events'
        fields = ['assembly_part__part__name'] + CCCUserTableBase.Meta.fields
    assembly_part__part__name = Column(verbose_name='Inventory', linkify=dict(viewname="assemblies:assemblypart_detail", args=[tables2.A('assembly_part__pk')]))
    value_names = ManyToManyColumn(verbose_name='Configurations', accessor='config_defaults',
                    transform=lambda x: format_html('<b>{}:</b> {}<br>'.format(x.config_name,x.default_value)), separator='\n')

class ConstDefaultEventTable(CCCUserTableBase):
    class Meta(CCCUserTableBase.Meta):
        model = ConstDefaultEvent
        title = 'Constant Default-Events'
        fields = ['inventory__serial_number'] + CCCUserTableBase.Meta.fields
    inventory__serial_number = Column(verbose_name='Inventory', linkify=dict(viewname="inventory:inventory_detail", args=[tables2.A('inventory__pk')]))
    value_names = ManyToManyColumn(verbose_name='Constants', accessor='constant_defaults',
                    transform=lambda x: format_html('<b>{}:</b> {}<br>'.format(x.config_name,x.default_value)), separator='\n')

## Actions ##

class ActionTable(ActionUserTableBase):
    class Meta(ActionUserTableBase.Meta):
        model = Action
        title = 'Misc. Actions'

class BuildActionTable(ActionUserTableBase):
    class Meta(ActionUserTableBase.Meta):
        model = BuildAction
        title = 'Build Actions'
        fields = ['build'] + ActionUserTableBase.Meta.fields
    build = Column(linkify=dict(viewname="builds:builds_detail", args=[tables2.A('build__pk')]))

class DeploymentActionTable(ActionUserTableBase):
    class Meta(ActionUserTableBase.Meta):
        model = DeploymentAction
        title = 'Deployment Actions'
        fields = ['deployment'] + ActionUserTableBase.Meta.fields

    # workaround linking to deployment.
    def render_deployment(self, record):
        from django.urls import reverse
        build_url = reverse("builds:builds_detail", args=[record.deployment.build.pk])
        deployment_anchor = '#deployment-{}-'.format(record.deployment.pk)  # doesn't work, anchor doesn't exist
        deployment_anchor = '#deployments'  # next best anchor that does work
        html_string = '<a href={}>{}</a>'.format(build_url+deployment_anchor, record.deployment)
        return format_html(html_string)


# ========= FORM STUFF ========= #

class ListTextWidget(forms.TextInput):
    def __init__(self, data_list, name, *args, **kwargs):
        super(ListTextWidget, self).__init__(*args, **kwargs)
        self._name = name
        self._list = data_list
        self.attrs.update({'list':'list__{}'.format(self._name)})

    def render(self, name, value, attrs=None, renderer=None):
        text_html = super(ListTextWidget, self).render(name, value, attrs=attrs)
        data_list = '<datalist id="list__{}">'.format(self._name)
        for item in self._list:
            data_list += '<option value="{}">'.format(item)
        data_list += '</datalist>'
        return (text_html + data_list)


class UserSearchForm(forms.Form):
    q = forms.CharField(required=True, label='Name')
    ccc_role = forms.ChoiceField(label='CCC Role',choices=[('both','Both'),('app','Approver'),('rev','Reviewer')])
    ccc_status = forms.ChoiceField(label='CCC Status',choices=[('all','Show All'),('app','Show Approved'),('uapp','Show UnApproved')])

    def __init__(self, *args, **kwargs):
        default_userlist = User.objects.all().values_list('username',flat=True)
        userlist = kwargs.pop('data_list', default_userlist)
        super(UserSearchForm, self).__init__(*args, **kwargs)
        self.fields['q'].widget=ListTextWidget(userlist, name='userlist')


# ========= VIEWS ========= #

class UserSearchView(LoginRequiredMixin, tables2.MultiTableMixin, TemplateView):
    template_name = 'search/ReviewerApproverSearch.html'
    form_class = UserSearchForm
    table_pagination = {"per_page": 10}

    tables = [CalibrationTable,
              ConfigConstTable,
              CoefficientNameEventTable,
              ConfigNameEventTable,
              ConfigDefaultEventTable,
              ConstDefaultEventTable,
              DeploymentActionTable,
              BuildActionTable,
              ActionTable]

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)

        # disable ColumnShiftTable behavior
        for table in self.tables:
            if issubclass(table,ColumnShiftTable):
                table.shift_table_column = False

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for table in context['tables']:
            table.attrs['title'] = table.Meta.title if hasattr(table.Meta,'title') else table.__name__.replace('Table','s')
        return context

    def get_tables_data(self):
        if 'q' in self.request.GET:
            user_query = self.request.GET.get('q')
            ccc_role = self.request.GET.get('ccc_role',None)
            ccc_status = self.request.GET.get('ccc_status',None)
        else: # defaults
            user_query = self.request.user.username
            ccc_role = 'both'
            ccc_status = 'all'

        ccc_Q_approver = Q(user_approver__username__icontains=user_query) | Q(user_approver__name__icontains=user_query)
        ccc_Q_draft = Q(user_draft__username__icontains=user_query) | Q(user_draft__name__icontains=user_query)
        action_Q = Q(user__username__icontains=user_query) | Q(user__name__icontains=user_query)

        if ccc_role == 'both':
            ccc_Q = ccc_Q_approver | ccc_Q_draft
        elif ccc_role == 'app': ccc_Q = ccc_Q_approver
        elif ccc_role == 'rev': ccc_Q = ccc_Q_draft
        else: ccc_Q = Q(pk__in=[]) # else select none

        if ccc_status=='uapp':
            ccc_Q = ccc_Q & Q(approved=False)
        elif ccc_status=='app':
            ccc_Q = ccc_Q & Q(approved=True)
        # else show all CCCs regardless of approval status

        qs_list = []
        for table in self.tables:
            if  table.Meta.model in [Action, BuildAction, DeploymentAction]:
                action_qs = table.Meta.model.objects.select_related('user').filter(action_Q)
                qs_list.append(action_qs)
            else: # it's a CCC_qs
                ccc_model = table.Meta.model
                ccc_qs = ccc_model.objects.prefetch_related('user_approver','user_draft').filter(ccc_Q)
                qs_list.append(ccc_qs)

        return qs_list

    def get(self, request, *args, **kwargs):
        initial = dict(q=request.user.username, ccc_role='both', ccc_status='all')
        if 'q' in request.GET:
            form = self.form_class(request.GET)
        else:
            form = self.form_class(initial)
        context = self.get_context_data()
        context['form'] = form
        return self.render_to_response(context)
