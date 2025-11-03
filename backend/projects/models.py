from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from users.models import (
    Skill,
    CorporatePartnerProfile,
    AdminProfile,
    StudentProfile,
)


class Project(models.Model):
    DRAFT = 'DRAFT'
    OPEN = 'OPEN'
    CLOSED = 'CLOSED'
    ARCHIVED = 'ARCHIVED'
    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (OPEN, 'Open'),
        (CLOSED, 'Closed'),
        (ARCHIVED, 'Archived'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(CorporatePartnerProfile, on_delete=models.CASCADE, related_name='projects')
    skills_required = models.ManyToManyField(Skill, blank=True, related_name='projects')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT)
    approved_by = models.ForeignKey(AdminProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class StudentProjectSubmission(models.Model):
    SUBMITTED = 'SUBMITTED'
    REVIEWED = 'REVIEWED'
    APPROVED = 'APPROVED'
    STATUS_CHOICES = [
        (SUBMITTED, 'Submitted'),
        (REVIEWED, 'Reviewed'),
        (APPROVED, 'Approved'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='submissions')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='submissions')
    submission_link = models.URLField(blank=True)
    feedback = models.TextField(blank=True)
    grade = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'project')

    def __str__(self):
        return f"{self.student.user.email} -> {self.project.title}"


# class Module(models.Model):
    # pass  # moved to learning app


# class Resource(models.Model):
    # pass  # moved to learning app


# class Workbook(models.Model):
    # pass  # moved to learning app


# class WorkbookPurchase(models.Model):
    # pass  # moved to learning app

