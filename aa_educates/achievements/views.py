from rest_framework import viewsets
from .models import Skill, Badge, Certificate
from .serializers import SkillSerializer, BadgeSerializer, CertificateSerializer


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('name')
    serializer_class = SkillSerializer


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all().order_by('name')
    serializer_class = BadgeSerializer


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all().order_by('-issue_date')
    serializer_class = CertificateSerializer
