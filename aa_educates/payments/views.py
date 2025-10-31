from rest_framework import viewsets
from .models import PaymentTransaction, CRMContactLog
from .serializers import PaymentTransactionSerializer, CRMContactLogSerializer


class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all().order_by('-created_at')
    serializer_class = PaymentTransactionSerializer


class CRMContactLogViewSet(viewsets.ModelViewSet):
    queryset = CRMContactLog.objects.all().order_by('-timestamp')
    serializer_class = CRMContactLogSerializer
