from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    MentorProfileViewSet,
    SessionViewSet,
    SessionFeedbackViewSet,
)

router = DefaultRouter()
router.register(r'mentors', MentorProfileViewSet)
router.register(r'mentorship-sessions', SessionViewSet)
router.register(r'mentorship-feedback', SessionFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
