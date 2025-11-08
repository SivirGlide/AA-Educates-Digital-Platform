from rest_framework import permissions
from .models import User


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission: Admin can do anything, others can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or request.user.role == User.ADMIN
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission: Users can only access their own data, admins can access all.
    """
    def has_permission(self, request, view):
        # Allow authenticated users to access the view
        # Object-level permissions will be checked in has_object_permission
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_staff or request.user.role == User.ADMIN:
            return True
        
        # Check if object has user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For User model itself
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsStudentOwner(permissions.BasePermission):
    """
    Permission for StudentProfile: Student can view/edit own profile, admins can do all.
    Parents and schools can view linked students.
    """
    def has_permission(self, request, view):
        # Allow authenticated users - queryset filtering will restrict access
        # Students, parents, schools, and admins can access student profiles
        if not request.user or not request.user.is_authenticated:
            return False
        
        user_role = request.user.role
        allowed_roles = [User.STUDENT, User.PARENT, User.SCHOOL, User.ADMIN]
        return user_role in allowed_roles or request.user.is_staff
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == User.ADMIN:
            return True
        
        # Students can access their own profile
        if request.user.role == User.STUDENT:
            return obj.user == request.user
        
        # Parents can access their linked students
        if request.user.role == User.PARENT:
            parent_profile = getattr(request.user, 'parent_profile', None)
            if parent_profile:
                return obj in parent_profile.students.all()
            return False
        
        # Schools can access their students
        if request.user.role == User.SCHOOL:
            school_profile = getattr(request.user, 'school_profile', None)
            if school_profile:
                return obj.school == school_profile
            return False
        
        return False


class IsCorporatePartnerOrAdmin(permissions.BasePermission):
    """
    Permission for projects: Corporate partners can manage their own, admins can do all.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == 'ADMIN':
            return True
        
        # Check if object belongs to corporate partner
        if hasattr(obj, 'created_by'):
            return obj.created_by.user == request.user
        
        return False


class RoleBasedPermission(permissions.BasePermission):
    """
    Generic role-based permission checker.
    """
    allowed_roles = []
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admin/Staff can do anything
        if request.user.is_staff or request.user.role == 'ADMIN':
            return True
        
        # Check if user's role is in allowed roles
        return request.user.role in self.allowed_roles


class IsStudentRole(RoleBasedPermission):
    """Only students and admins can access."""
    allowed_roles = [User.STUDENT, User.ADMIN]


class IsParentRole(RoleBasedPermission):
    """Only parents and admins can access."""
    allowed_roles = [User.PARENT, User.ADMIN]


class IsCorporatePartnerRole(RoleBasedPermission):
    """Only corporate partners and admins can access."""
    allowed_roles = [User.CORPORATE_PARTNER, User.ADMIN]


class IsSchoolRole(RoleBasedPermission):
    """Only schools and admins can access."""
    allowed_roles = [User.SCHOOL, User.ADMIN]


class IsOwnerOrRoleOrAdmin(permissions.BasePermission):
    """
    Permission that allows access if user owns the object, has the required role, or is an admin.
    Used for profile viewsets to restrict access by role.
    """
    required_role = None
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admins can always access
        if request.user.is_staff or request.user.role == 'ADMIN':
            return True
        
        # Check if user has the required role
        if self.required_role:
            return request.user.role == self.required_role
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_staff or request.user.role == User.ADMIN:
            return True
        
        # Check if object has user attribute and user owns it
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class IsParentProfileOwner(IsOwnerOrRoleOrAdmin):
    """Only parents (owning their profile) and admins can access."""
    required_role = User.PARENT


class IsCorporatePartnerProfileOwner(IsOwnerOrRoleOrAdmin):
    """Only corporate partners (owning their profile) and admins can access."""
    required_role = User.CORPORATE_PARTNER


class IsSchoolProfileOwner(IsOwnerOrRoleOrAdmin):
    """Only schools (owning their profile) and admins can access."""
    required_role = User.SCHOOL


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Permission for objects with GenericForeignKey author fields (Post, Comment).
    Everyone can read, but only authors or admins can write/edit/delete.
    """
    def has_object_permission(self, request, view, obj):
        # Everyone can read (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Admin can do anything
        if request.user.is_staff or request.user.role == User.ADMIN:
            return True
        
        # Check if object has author GenericForeignKey
        if not hasattr(obj, 'author_content_type') or not hasattr(obj, 'author_object_id'):
            return False
        
        from django.contrib.contenttypes.models import ContentType
        from users.models import StudentProfile
        from mentorship.models import MentorProfile
        
        # Check if author is a StudentProfile matching the current user
        student_ct = ContentType.objects.get_for_model(StudentProfile)
        if obj.author_content_type == student_ct:
            if hasattr(request.user, 'student_profile'):
                return obj.author_object_id == request.user.student_profile.id
        
        # Check if author is a MentorProfile (if mentor is linked to corporate partner)
        mentor_ct = ContentType.objects.get_for_model(MentorProfile)
        if obj.author_content_type == mentor_ct:
            # For mentors, we'd need to check if they're linked to the user
            # This is simplified - full implementation would require checking mentor relationships
            pass
        
        return False

