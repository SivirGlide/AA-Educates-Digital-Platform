from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    STUDENT = 'STUDENT'
    PARENT = 'PARENT'
    SCHOOL = 'SCHOOL'
    CORPORATE_PARTNER = 'CORPORATE_PARTNER'
    ADMIN = 'ADMIN'

    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (PARENT, 'Parent'),
        (SCHOOL, 'School'),
        (CORPORATE_PARTNER, 'Corporate Partner'),
        (ADMIN, 'Admin'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=STUDENT)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email or self.username


class SchoolProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='school_profile')
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    school = models.ForeignKey(SchoolProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    bio = models.TextField(blank=True)
    cv = models.TextField(blank=True)
    portfolio_link = models.URLField(blank=True)
    badges = models.ManyToManyField('achievements.Badge', blank=True, related_name='students')
    certificates = models.ManyToManyField('achievements.Certificate', blank=True, related_name='students')
    skills = models.ManyToManyField('achievements.Skill', blank=True, related_name='students')

    def __str__(self):
        return f"StudentProfile({self.user.email})"


class ParentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    students = models.ManyToManyField(StudentProfile, blank=True, related_name='parents')

    def __str__(self):
        return f"ParentProfile({self.user.email})"


class CorporatePartnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='corporate_profile')
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=150, blank=True)
    website = models.URLField(blank=True)
    csr_report_link = models.URLField(blank=True)
    logo = models.URLField(blank=True)

    def __str__(self):
        return self.company_name


class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')

    def __str__(self):
        return f"AdminProfile({self.user.email})"

