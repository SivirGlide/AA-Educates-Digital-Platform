from rest_framework import serializers
from .models import (
    Project,
    StudentProjectSubmission,
)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'created_by', 'skills_required',
            'start_date', 'end_date', 'status', 'approved_by',
            'created_at', 'updated_at'
        ]


class StudentProjectSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProjectSubmission
        fields = [
            'id', 'student', 'project', 'submission_link', 'feedback', 'grade',
            'status', 'submitted_at', 'updated_at'
        ]



