from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import reverse, reverse_lazy
from django.views.generic import DetailView, CreateView, ListView, RedirectView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

from .forms import LocationForm
from .models import Location
from common.util.mixins import AjaxFormMixin

# AJAX functions for Forms and Navtree
# ------------------------------------------------------------------------------

# Main Navtree function
def load_locations_navtree(request):
    locations = Location.objects.all()
    return render(request, 'locations/ajax_location_navtree.html', {'locations': locations})


# Mooring CBV Views for CRUD operations and menu Actions
# ------------------------------------------------------------------------------
# AJAX Views

class LocationsAjaxDetailView(LoginRequiredMixin, DetailView):
    model = Location
    context_object_name = 'location'
    template_name='locations/ajax_location_detail.html'


class LocationsAjaxUpdateView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, UpdateView):
    model = Location
    form_class = LocationForm
    context_object_name = 'location'
    template_name='locations/ajax_location_form.html'
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def form_valid(self, form):
        self.object = form.save()
        # Rebuild the Location MPTT tree
        Location._tree_manager.rebuild()
        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.id,
            }
            return JsonResponse(data)
        else:
            return response

    def get_success_url(self):
        return reverse('locations:ajax_location_detail', args=(self.object.id,))


class LocationsAjaxCreateView(LoginRequiredMixin, PermissionRequiredMixin, AjaxFormMixin, CreateView):
    model = Location
    form_class = LocationForm
    context_object_name = 'location'
    template_name='locations/ajax_location_form.html'
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def form_valid(self, form):
        self.object = form.save()
        # Rebuild the Location MPTT tree
        Location._tree_manager.rebuild()
        response = HttpResponseRedirect(self.get_success_url())

        if self.request.is_ajax():
            print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data.",
                'object_id': self.object.id,
            }
            return JsonResponse(data)
        else:
            return response

    def get_success_url(self):
        return reverse('locations:ajax_location_detail', args=(self.object.id,))


class LocationsAjaxDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Location
    template_name = 'locations/ajax_location_confirm_delete.html'
    #success_url = reverse_lazy('locations:locations_list')
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        data = {
            'message': "Successfully submitted form data.",
            'parent_id': self.object.parent_id,
        }
        self.object.delete()

        # Rebuild the Location MPTT tree
        Location._tree_manager.rebuild()

        return JsonResponse(data)


# Location Base Views

class LocationsHomeView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = 'locations/location_list.html'
    context_object_name = 'locations'
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(LocationsHomeView, self).get_context_data(**kwargs)
        context.update({
            'node_type': 'locations'
        })
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)


class LocationsDetailView(LoginRequiredMixin, DetailView):
    model = Location
    context_object_name = 'location'
    template_name='locations/location_detail.html'

    def get_context_data(self, **kwargs):
        context = super(LocationsDetailView, self).get_context_data(**kwargs)
        context.update({
            'node_type': 'locations'
        })
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)

class LocationsCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Location
    form_class = LocationForm
    context_object_name = 'location'
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(LocationsCreateView, self).get_context_data(**kwargs)
        context.update({
            'locations': Location.objects.all()
        })
        return context

    def get_success_url(self):
        return reverse('locations:locations_detail', args=(self.object.id, ))


class LocationsUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Location
    form_class = LocationForm
    context_object_name = 'location'
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'

    def get_context_data(self, **kwargs):
        context = super(LocationsUpdateView, self).get_context_data(**kwargs)
        context.update({
            'locations': Location.objects.all()
        })
        return context

    def get_success_url(self):
        return reverse('locations:locations_detail', args=(self.object.id, ))


class LocationsDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Location
    success_url = reverse_lazy('locations:locations_home')
    permission_required = 'locations.add_location'
    redirect_field_name = 'home'
