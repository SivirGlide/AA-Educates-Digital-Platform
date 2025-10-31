from rest_framework import serializers
from .models import MentorProfile, Session, SessionFeedback


class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = ['id', 'user', 'bio', 'skills', 'availability']


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = [
            'id', 'mentor', 'student', 'session_type',
            'date_time', 'duration', 'status', 'meeting_link'
        ]


class SessionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionFeedback
        fields = ['id', 'session', 'student', 'rating', 'comments', 'created_at']
        read_only_fields = ['created_at']


