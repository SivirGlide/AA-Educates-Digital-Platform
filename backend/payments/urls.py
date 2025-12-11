from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentTransactionViewSet,
    CRMContactLogViewSet,
    create_checkout_session,
    verify_payment,
)

router = DefaultRouter()
router.register(r'payment-transactions', PaymentTransactionViewSet)
router.register(r'crm-contact-logs', CRMContactLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('verify-payment/', verify_payment, name='verify-payment'),
]
