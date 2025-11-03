from rest_framework import viewsets
from .models import Module, Resource, Workbook, WorkbookPurchase
from .serializers import (
    ModuleSerializer,
    ResourceSerializer,
    WorkbookSerializer,
    WorkbookPurchaseSerializer,
)


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all().order_by('-created_at')
    serializer_class = ModuleSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class WorkbookViewSet(viewsets.ModelViewSet):
    queryset = Workbook.objects.all()
    serializer_class = WorkbookSerializer


class WorkbookPurchaseViewSet(viewsets.ModelViewSet):
    queryset = WorkbookPurchase.objects.all().order_by('-date')
    serializer_class = WorkbookPurchaseSerializer
