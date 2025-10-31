from rest_framework import serializers
from .models import ProgressTracker, EngagementLog, ImpactReport


class ProgressTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressTracker
        fields = ['id', 'student', 'project', 'module', 'progress_percent', 'last_updated']
        read_only_fields = ['last_updated']


class EngagementLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementLog
        fields = ['id', 'user', 'action_type', 'timestamp', 'metadata']
        read_only_fields = ['timestamp']


class ImpactReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactReport
        fields = [
            'id', 'corporate_partner', 'projects_completed_count',
            'students_impacted', 'csr_points', 'generated_at'
        ]
        read_only_fields = ['generated_at']
