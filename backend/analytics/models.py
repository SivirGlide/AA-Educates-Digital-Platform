from django.db import models
from users.models import User, StudentProfile, CorporatePartnerProfile
from projects.models import Project
from learning.models import Module


class ProgressTracker(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='progress_trackers')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='progress_trackers', null=True, blank=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='progress_trackers', null=True, blank=True)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Progress {self.progress_percent}% for {self.student.user.email}"


class EngagementLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='engagement_logs')
    action_type = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.user.email} {self.action_type} @ {self.timestamp}"


class ImpactReport(models.Model):
    corporate_partner = models.ForeignKey(CorporatePartnerProfile, on_delete=models.CASCADE, related_name='impact_reports')
    projects_completed_count = models.PositiveIntegerField(default=0)
    students_impacted = models.PositiveIntegerField(default=0)
    csr_points = models.PositiveIntegerField(default=0)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ImpactReport for {self.corporate_partner.company_name}"
