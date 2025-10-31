from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    StudentProfileViewSet,
    ParentProfileViewSet,
    SchoolProfileViewSet,
    CorporatePartnerProfileViewSet,
    AdminProfileViewSet,
    BadgeViewSet,
    CertificateViewSet,
    SkillViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'students', StudentProfileViewSet)
router.register(r'parents', ParentProfileViewSet)
router.register(r'schools', SchoolProfileViewSet)
router.register(r'corporate-partners', CorporatePartnerProfileViewSet)
router.register(r'admins', AdminProfileViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'certificates', CertificateViewSet)
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

