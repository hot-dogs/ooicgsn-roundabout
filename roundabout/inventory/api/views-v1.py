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

from rest_framework import generics, viewsets, filters
from rest_framework.parsers import FormParser, MultiPartParser

from ..models import Inventory, Action
from .serializers import InventorySerializer, ActionSerializer


class ActionViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser,)
    serializer_class = ActionSerializer
    filterset_fields = {
        'created_at':['gte', 'lte', 'exact', 'gt', 'lt'],
        'inventory':['exact'],
        'action_type':['exact'],
        'object_type':['exact'],
    }

    def get_queryset(self):
        queryset = Action.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset
    """
    def perform_create(self, serializer):
        instance = serializer.save()
        print(instance)
    """


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    filterset_fields = ['serial_number',]

    def get_queryset(self):
        queryset = Inventory.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset

"""
class InventoryFullTextViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InventoryFullTextSerializer
    #filter_backends = [DjangoFilterBackend]
    filterset_fields = ['serial_number',]

    def get_queryset(self):
        queryset = Inventory.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset
"""