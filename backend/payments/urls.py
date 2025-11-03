from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PaymentTransactionViewSet, CRMContactLogViewSet

router = DefaultRouter()
router.register(r'payment-transactions', PaymentTransactionViewSet)
router.register(r'crm-contact-logs', CRMContactLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
