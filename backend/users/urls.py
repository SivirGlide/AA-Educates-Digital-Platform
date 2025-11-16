from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    UserViewSet,
    StudentProfileViewSet,
    ParentProfileViewSet,
    SchoolProfileViewSet,
    CorporatePartnerProfileViewSet,
    AdminProfileViewSet,
)
from .auth_views import login, register

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'students', StudentProfileViewSet)
router.register(r'parents', ParentProfileViewSet)
router.register(r'schools', SchoolProfileViewSet)
router.register(r'corporate-partners', CorporatePartnerProfileViewSet)
router.register(r'admins', AdminProfileViewSet)

urlpatterns = [
    # Authentication endpoints (at /api/users/auth/...)
    path('auth/login/', login, name='login'),
    path('auth/register/', register, name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # App routes
    path('', include(router.urls)),
]

