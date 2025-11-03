from django.db import models
from users.models import User


class PaymentTransaction(models.Model):
    STRIPE = 'STRIPE'
    PAYPAL = 'PAYPAL'
    PROVIDER_CHOICES = [
        (STRIPE, 'Stripe'),
        (PAYPAL, 'PayPal'),
    ]

    PENDING = 'PENDING'
    SUCCEEDED = 'SUCCEEDED'
    FAILED = 'FAILED'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (SUCCEEDED, 'Succeeded'),
        (FAILED, 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GBP')
    provider = models.CharField(max_length=10, choices=PROVIDER_CHOICES)
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.provider}:{self.transaction_id} ({self.status})"


class CRMContactLog(models.Model):
    EMAIL = 'EMAIL'
    PHONE = 'PHONE'
    CONTACT_METHOD_CHOICES = [
        (EMAIL, 'Email'),
        (PHONE, 'Phone'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crm_contact_logs')
    contact_method = models.CharField(max_length=10, choices=CONTACT_METHOD_CHOICES)
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CRM {self.contact_method} with {self.user.email}"
