from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.URLField(blank=True)
    criteria = models.TextField(blank=True)
    skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, blank=True, related_name='badges')

    def __str__(self):
        return self.name


class Certificate(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='certificates/', blank=True)
    issued_to = models.ForeignKey('users.StudentProfile', on_delete=models.CASCADE, related_name='certificates_issued')
    issued_by = models.ForeignKey('users.AdminProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates_issued')
    issue_date = models.DateField()

    def __str__(self):
        return self.title
