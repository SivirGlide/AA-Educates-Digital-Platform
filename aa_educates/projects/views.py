from rest_framework import viewsets
from .models import (
    Project,
    StudentProjectSubmission,
)
from .serializers import (
    ProjectSerializer,
    StudentProjectSubmissionSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer


class StudentProjectSubmissionViewSet(viewsets.ModelViewSet):
    queryset = StudentProjectSubmission.objects.all().order_by('-submitted_at')
    serializer_class = StudentProjectSubmissionSerializer



