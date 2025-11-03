from rest_framework import viewsets
from .models import (
    User,
    StudentProfile,
    ParentProfile,
    SchoolProfile,
    CorporatePartnerProfile,
    AdminProfile,
    Badge,
    Certificate,
    Skill,
)
from .serializers import (
    UserSerializer,
    StudentProfileSerializer,
    ParentProfileSerializer,
    SchoolProfileSerializer,
    CorporatePartnerProfileSerializer,
    AdminProfileSerializer,
    BadgeSerializer,
    CertificateSerializer,
    SkillSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer


class ParentProfileViewSet(viewsets.ModelViewSet):
    queryset = ParentProfile.objects.all()
    serializer_class = ParentProfileSerializer


class SchoolProfileViewSet(viewsets.ModelViewSet):
    queryset = SchoolProfile.objects.all()
    serializer_class = SchoolProfileSerializer


class CorporatePartnerProfileViewSet(viewsets.ModelViewSet):
    queryset = CorporatePartnerProfile.objects.all()
    serializer_class = CorporatePartnerProfileSerializer


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

