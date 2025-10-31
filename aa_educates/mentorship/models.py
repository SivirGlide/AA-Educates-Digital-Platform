from django.db import models
from users.models import (
    CorporatePartnerProfile,
    StudentProfile,
    AdminProfile,
)


class MentorProfile(models.Model):
    # If mentors are corporate partner reps, link here; else leave null for independent mentors
    user = models.ForeignKey(CorporatePartnerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='mentors')
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True)  # simple CSV/paragraph for now
    availability = models.TextField(blank=True)

    def __str__(self):
        return f"Mentor({self.user.company_name if self.user else 'Independent'})"


class Session(models.Model):
    ONE_TO_ONE = 'ONE_TO_ONE'
    GROUP = 'GROUP'
    CAREER_COACHING = 'CAREER_COACHING'
    SESSION_TYPES = [
        (ONE_TO_ONE, '1:1'),
        (GROUP, 'Group'),
        (CAREER_COACHING, 'Career Coaching'),
    ]

    BOOKED = 'BOOKED'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'
    STATUS_CHOICES = [
        (BOOKED, 'Booked'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
    ]

    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='sessions')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='mentorship_sessions')
    session_type = models.CharField(max_length=32, choices=SESSION_TYPES, default=ONE_TO_ONE)
    date_time = models.DateTimeField()
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=BOOKED)
    meeting_link = models.URLField(blank=True)

    def __str__(self):
        return f"{self.session_type} with {self.student.user.email}"


class SessionFeedback(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='feedbacks')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='session_feedbacks')
    rating = models.PositiveSmallIntegerField()
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'student')

    def __str__(self):
        return f"Feedback for session {self.session_id}"

