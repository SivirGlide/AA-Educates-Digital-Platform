from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import (
    User,
    StudentProfile,
    ParentProfile,
    SchoolProfile,
    CorporatePartnerProfile,
    AdminProfile,
)
from .serializers import (
    UserSerializer,
    StudentProfileSerializer,
    ParentProfileSerializer,
    SchoolProfileSerializer,
    CorporatePartnerProfileSerializer,
    AdminProfileSerializer,
)
from .permissions import (
    IsOwnerOrAdmin,
    IsStudentOwner,
    IsParentProfileOwner,
    IsCorporatePartnerProfileOwner,
    IsSchoolProfileOwner,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        """
        Users can only see their own user object, admins can see all.
        """
        if self.request.user.is_staff or self.request.user.role == User.ADMIN:
            return User.objects.all().order_by('-date_joined')
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user's information.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsStudentOwner]

    def get_queryset(self):
        """
        Students can only see their own profile.
        Parents can see their linked students.
        Admins can see all students.
        Schools can see their students.
        """
        user = self.request.user
        
        # Admins can see all
        if user.is_staff or user.role == User.ADMIN:
            return StudentProfile.objects.all()
        
        # Students can only see their own profile
        if user.role == User.STUDENT:
            return StudentProfile.objects.filter(user=user)
        
        # Parents can see their linked students
        if user.role == User.PARENT:
            parent_profile = getattr(user, 'parent_profile', None)
            if parent_profile:
                return parent_profile.students.all()
            return StudentProfile.objects.none()
        
        # Schools can see their students
        if user.role == User.SCHOOL:
            school_profile = getattr(user, 'school_profile', None)
            if school_profile:
                return school_profile.students.all()
            return StudentProfile.objects.none()
        
        # Corporate partners and others cannot access student profiles
        return StudentProfile.objects.none()


class ParentProfileViewSet(viewsets.ModelViewSet):
    queryset = ParentProfile.objects.all()
    serializer_class = ParentProfileSerializer
    permission_classes = [IsParentProfileOwner]

    def get_queryset(self):
        """
        Parents can only see their own profile.
        Admins can see all parent profiles.
        """
        user = self.request.user
        
        # Admins can see all
        if user.is_staff or user.role == User.ADMIN:
            return ParentProfile.objects.all()
        
        # Parents can only see their own profile
        if user.role == User.PARENT:
            return ParentProfile.objects.filter(user=user)
        
        # Others cannot access parent profiles
        return ParentProfile.objects.none()


class SchoolProfileViewSet(viewsets.ModelViewSet):
    queryset = SchoolProfile.objects.all()
    serializer_class = SchoolProfileSerializer
    permission_classes = [IsSchoolProfileOwner]

    def get_queryset(self):
        """
        Schools can only see their own profile.
        Admins can see all school profiles.
        """
        user = self.request.user
        
        # Admins can see all
        if user.is_staff or user.role == User.ADMIN:
            return SchoolProfile.objects.all()
        
        # Schools can only see their own profile
        if user.role == User.SCHOOL:
            return SchoolProfile.objects.filter(user=user)
        
        # Others cannot access school profiles
        return SchoolProfile.objects.none()


class CorporatePartnerProfileViewSet(viewsets.ModelViewSet):
    queryset = CorporatePartnerProfile.objects.all()
    serializer_class = CorporatePartnerProfileSerializer
    permission_classes = [IsCorporatePartnerProfileOwner]

    def get_queryset(self):
        """
        Corporate partners can only see their own profile.
        Admins can see all corporate partner profiles.
        """
        user = self.request.user
        
        # Admins can see all
        if user.is_staff or user.role == User.ADMIN:
            return CorporatePartnerProfile.objects.all()
        
        # Corporate partners can only see their own profile
        if user.role == User.CORPORATE_PARTNER:
            return CorporatePartnerProfile.objects.filter(user=user)
        
        # Others cannot access corporate partner profiles
        return CorporatePartnerProfile.objects.none()


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        """
        Only admins can access admin profiles.
        """
        user = self.request.user
        
        # Only admins can see admin profiles
        if user.is_staff or user.role == User.ADMIN:
            return AdminProfile.objects.all()
        
        # Others cannot access admin profiles
        return AdminProfile.objects.none()

