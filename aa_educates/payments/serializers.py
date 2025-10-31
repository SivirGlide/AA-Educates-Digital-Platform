from rest_framework import serializers
from .models import PaymentTransaction, CRMContactLog


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'user', 'amount', 'currency', 'provider',
            'transaction_id', 'status', 'created_at'
        ]
        read_only_fields = ['created_at']


class CRMContactLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CRMContactLog
        fields = ['id', 'user', 'contact_method', 'notes', 'timestamp']
        read_only_fields = ['timestamp']
