from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users.models import User
from users.permissions import IsCorporatePartnerOrAdmin
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
    permission_classes = [IsAuthenticated, IsCorporatePartnerOrAdmin]
    
    def get_queryset(self):
        """
        Corporate partners can only see projects they created.
        Admins can see all projects.
        Students and others can see all projects (read-only via permissions).
        """
        user = self.request.user
        
        # Admins can see all projects
        if user.is_staff or user.role == User.ADMIN:
            return Project.objects.all().order_by('-created_at')
        
        # Corporate partners can only see their own projects
        if user.role == User.CORPORATE_PARTNER:
            try:
                corporate_profile = user.corporate_profile
                return Project.objects.filter(created_by=corporate_profile).order_by('-created_at')
            except AttributeError:
                # User doesn't have a corporate partner profile
                return Project.objects.none()
        
        # For other roles (students, parents, etc.), they can see all projects
        # but permissions will restrict what they can do (read-only)
        return Project.objects.all().order_by('-created_at')


class StudentProjectSubmissionViewSet(viewsets.ModelViewSet):
    queryset = StudentProjectSubmission.objects.all().order_by('-submitted_at')
    serializer_class = StudentProjectSubmissionSerializer



