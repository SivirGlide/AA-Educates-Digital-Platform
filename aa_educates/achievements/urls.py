from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, BadgeViewSet, CertificateViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'certificates', CertificateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
