from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegisterAPIView.as_view(), name = 'register'),
]