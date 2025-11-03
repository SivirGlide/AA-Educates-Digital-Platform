from rest_framework import viewsets
from .models import ProgressTracker, EngagementLog, ImpactReport
from .serializers import ProgressTrackerSerializer, EngagementLogSerializer, ImpactReportSerializer


class ProgressTrackerViewSet(viewsets.ModelViewSet):
    queryset = ProgressTracker.objects.all().order_by('-last_updated')
    serializer_class = ProgressTrackerSerializer


class EngagementLogViewSet(viewsets.ModelViewSet):
    queryset = EngagementLog.objects.all().order_by('-timestamp')
    serializer_class = EngagementLogSerializer


class ImpactReportViewSet(viewsets.ModelViewSet):
    queryset = ImpactReport.objects.all().order_by('-generated_at')
    serializer_class = ImpactReportSerializer
