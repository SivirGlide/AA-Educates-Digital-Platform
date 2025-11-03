from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    StudentProjectSubmissionViewSet,
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'student-submissions', StudentProjectSubmissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

