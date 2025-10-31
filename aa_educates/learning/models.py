from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import AdminProfile, ParentProfile, SchoolProfile


class Module(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    resource_file = models.FileField(upload_to='module_resources/', blank=True)
    created_by = models.ForeignKey(AdminProfile, on_delete=models.CASCADE, related_name='learning_modules')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Resource(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='resources/')
    category = models.CharField(max_length=100, blank=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='resources')

    def __str__(self):
        return self.title


class Workbook(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pdf_file = models.FileField(upload_to='workbooks/')
    created_by = models.ForeignKey(AdminProfile, on_delete=models.CASCADE, related_name='learning_workbooks')

    def __str__(self):
        return self.title


class WorkbookPurchase(models.Model):
    PENDING = 'PENDING'
    PAID = 'PAID'
    FAILED = 'FAILED'
    PAYMENT_STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (PAID, 'Paid'),
        (FAILED, 'Failed'),
    ]

    workbook = models.ForeignKey(Workbook, on_delete=models.CASCADE, related_name='purchases')

    # Generic purchaser: ParentProfile or SchoolProfile
    purchaser_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    purchaser_object_id = models.PositiveIntegerField()
    purchaser = GenericForeignKey('purchaser_content_type', 'purchaser_object_id')

    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=PENDING)
    transaction_id = models.CharField(max_length=100, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.workbook.title} purchase ({self.payment_status})"
