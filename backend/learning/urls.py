from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, ResourceViewSet, WorkbookViewSet, WorkbookPurchaseViewSet

router = DefaultRouter()
router.register(r'modules', ModuleViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'workbooks', WorkbookViewSet)
router.register(r'workbook-purchases', WorkbookPurchaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
