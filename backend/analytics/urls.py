from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ProgressTrackerViewSet, EngagementLogViewSet, ImpactReportViewSet

router = DefaultRouter()
router.register(r'progress-trackers', ProgressTrackerViewSet)
router.register(r'engagement-logs', EngagementLogViewSet)
router.register(r'impact-reports', ImpactReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
