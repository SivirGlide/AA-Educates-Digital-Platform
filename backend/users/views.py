from rest_framework import viewsets
from .models import (
    User,
    StudentProfile,
    ParentProfile,
    SchoolProfile,
    CorporatePartnerProfile,
    AdminProfile,
)
from .serializers import (
    UserSerializer,
    StudentProfileSerializer,
    ParentProfileSerializer,
    SchoolProfileSerializer,
    CorporatePartnerProfileSerializer,
    AdminProfileSerializer,
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

