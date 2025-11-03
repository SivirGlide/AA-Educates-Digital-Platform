from rest_framework import viewsets
from .models import MentorProfile, Session, SessionFeedback
from .serializers import (
    MentorProfileSerializer,
    SessionSerializer,
    SessionFeedbackSerializer,
)


class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().order_by('-date_time')
    serializer_class = SessionSerializer


class SessionFeedbackViewSet(viewsets.ModelViewSet):
    queryset = SessionFeedback.objects.all().order_by('-created_at')
    serializer_class = SessionFeedbackSerializer


