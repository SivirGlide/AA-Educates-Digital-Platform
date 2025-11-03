# User Permissions System Documentation

## 📋 Overview

The AA Educates platform uses a **two-tier permission system**:
1. **Django Model Permissions** - Database-level permissions (stored in DB)
2. **DRF View Permissions** - API-level permissions (enforced at request time)

This ensures users can only access and modify data they're authorized to see.

---

## 🎯 Why Permissions?

**Security & Data Privacy:**
- Students shouldn't see other students' private information
- Parents should only see their linked children's data
- Corporate partners should only manage their own projects
- Admins can manage everything

**Compliance:**
- Protects user data (GDPR, data privacy laws)
- Prevents unauthorized access
- Maintains data integrity

---

## 🏗️ Architecture

### 1. User Roles

The platform has **5 user roles**:

```python
STUDENT           # Students learning on the platform
PARENT            # Parents monitoring their children
SCHOOL            # Schools managing their students
CORPORATE_PARTNER # Companies offering projects/mentorship
ADMIN             # Platform administrators
```

### 2. Permission Layers

```
┌─────────────────────────────────────────┐
│  HTTP Request                          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  DRF Authentication                     │
│  (Session/Basic Auth)                    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  DRF Permission Classes                 │
│  (View-level checks)                    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Custom Queryset Filtering               │
│  (Data-level filtering)                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Response (filtered data)                │
└─────────────────────────────────────────┘
```

---

## 🔐 Model-Level Permissions

**Location:** `users/models.py` - `Meta.permissions`

These are **Django permissions** stored in the database. They define **what actions** users can perform.

### Example: User Model Permissions

```python
class User(AbstractUser):
    class Meta:
        permissions = [
            ('view_own_profile', 'Can view own profile'),
            ('edit_own_profile', 'Can edit own profile'),
            ('manage_students', 'Can manage students'),
            ('manage_projects', 'Can manage projects'),
        ]
```

**How to use:**
```python
# In Django admin or code
user.has_perm('users.view_own_profile')
user.has_perm('users.manage_students')
```

**When to use:**
- For Django admin interface
- For programmatic checks in views/utils
- For fine-grained permission checks

---

## 🛡️ DRF View-Level Permissions

**Location:** `users/views.py` - `permission_classes`

These are **REST Framework permissions** that control **API access** at the viewset level.

### Built-in Permission Classes

#### `IsAuthenticated`
- **What:** User must be logged in
- **Use:** Default for most endpoints
- **Example:** Any authenticated user can access

#### `IsAdminUser`
- **What:** User must be staff/admin
- **Use:** Admin-only endpoints
- **Example:** `/users/admins/` - only admins can access

#### `IsAdminOrReadOnly`
- **What:** Anyone can read, only admins can write
- **Use:** Public read endpoints (badges, skills, certificates)
- **Example:** Students can view badges, only admins can create/edit

### Custom Permission Classes

**Location:** `users/permissions.py`

#### `IsOwnerOrAdmin`
```python
class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Users can only access their own data, admins can access all.
    """
```

**How it works:**
- Checks if `obj.user == request.user`
- Admins/staff always pass
- Used for: User profiles, Parent profiles, School profiles

**Example:**
```python
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdmin]
    # Students can only see their own user object
    # Admins can see all users
```

#### `IsStudentOwner`
```python
class IsStudentOwner(permissions.BasePermission):
    """
    Students can view/edit own profile, admins can do all.
    """
```

**How it works:**
- Checks `obj.user == request.user` for students
- Admins always pass
- Used for: Student profiles

**Example:**
```python
class StudentProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsStudentOwner]
    # Student can only access their own StudentProfile
    # Admin can access all
```

#### `IsCorporatePartnerOrAdmin`
```python
class IsCorporatePartnerOrAdmin(permissions.BasePermission):
    """
    Corporate partners can manage their own resources, admins can do all.
    """
```

**How it works:**
- Checks if `obj.created_by.user == request.user`
- Used for: Projects created by corporate partners

---

## 📊 Queryset Filtering

Even with permissions, we **filter querysets** to ensure users only see data they're allowed to see.

### Example: UserViewSet

```python
def get_queryset(self):
    if self.request.user.is_staff or self.request.user.role == User.ADMIN:
        return User.objects.all()  # Admins see all
    return User.objects.filter(id=self.request.user.id)  # Others see only self
```

**Why both permissions AND filtering?**
- Permissions control **access** (can you use this endpoint?)
- Filtering controls **data** (what data do you see?)

### Example: StudentProfileViewSet

```python
def get_queryset(self):
    # Admins see all
    if self.request.user.is_staff or self.request.user.role == User.ADMIN:
        return StudentProfile.objects.all()
    
    # Parents see linked students
    if self.request.user.role == User.PARENT:
        parent_profile = getattr(self.request.user, 'parent_profile', None)
        if parent_profile:
            return parent_profile.students.all()
    
    # Students see only own profile
    return StudentProfile.objects.filter(user=self.request.user)
```

---

## 🔍 Permission Flow Example

### Scenario: Student trying to view users

1. **Request:** `GET /users/users/` (no auth)
   - ❌ **Permission Check:** `IsAuthenticated` fails
   - **Response:** `403 Forbidden` or `401 Unauthorized`

2. **Request:** `GET /users/users/` (authenticated as student)
   - ✅ **Permission Check:** `IsAuthenticated` passes
   - ✅ **Permission Check:** `IsOwnerOrAdmin` passes (for queryset)
   - ✅ **Queryset Filter:** `User.objects.filter(id=student.id)`
   - **Response:** `200 OK` with only student's own user data

3. **Request:** `GET /users/users/` (authenticated as admin)
   - ✅ **Permission Check:** `IsAuthenticated` passes
   - ✅ **Permission Check:** `IsOwnerOrAdmin` passes
   - ✅ **Queryset Filter:** `User.objects.all()` (no filter for admin)
   - **Response:** `200 OK` with all users

---

## 📝 API Endpoint Permissions Summary

| Endpoint | Permission Class | Who Can Access |
|----------|-----------------|----------------|
| `/users/users/` | `IsAuthenticated` + `IsOwnerOrAdmin` | Own profile (students), All (admins) |
| `/users/users/me/` | `IsAuthenticated` | Any authenticated user |
| `/users/students/` | `IsAuthenticated` + `IsStudentOwner` | Own profile (students), Linked students (parents), All (admins) |
| `/users/parents/` | `IsAuthenticated` + `IsOwnerOrAdmin` | Own profile (parents), All (admins) |
| `/users/schools/` | `IsAuthenticated` + `IsOwnerOrAdmin` | Own profile (schools), All (admins) |
| `/users/corporate-partners/` | `IsAuthenticated` + `IsOwnerOrAdmin` | Own profile (corp partners), All (admins) |
| `/users/admins/` | `IsAdminUser` | Admins only |
| `/users/badges/` | `IsAdminOrReadOnly` | Read: all authenticated, Write: admins |
| `/users/certificates/` | `IsAdminOrReadOnly` | Read: all authenticated, Write: admins |
| `/users/skills/` | `IsAdminOrReadOnly` | Read: all authenticated, Write: admins |

---

## 🧪 Testing Permissions

### Manual Testing with curl

```bash
# Test 1: Unauthenticated (should fail)
curl http://127.0.0.1:8000/users/users/
# Expected: 401 or 403

# Test 2: As student (should see only own profile)
curl -u student1:student123 http://127.0.0.1:8000/users/users/
# Expected: 200 OK, returns only student1's data

# Test 3: As admin (should see all users)
curl -u admin:admin123 http://127.0.0.1:8000/users/users/
# Expected: 200 OK, returns all users

# Test 4: Get current user
curl -u student1:student123 http://127.0.0.1:8000/users/users/me/
# Expected: 200 OK, returns current user's profile
```

### Automated Testing

Run the test suite:
```bash
python3 manage.py test users.tests.test_permissions
```

---

## 🎓 Common Permission Patterns

### Pattern 1: Owner-Only Access

```python
# Permission class
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user

# Viewset
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return MyModel.objects.all()
        return MyModel.objects.filter(user=self.request.user)
```

**Use when:** Users should only see/modify their own resources.

### Pattern 2: Role-Based Access

```python
class RoleBasedPermission(permissions.BasePermission):
    allowed_roles = []
    
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return request.user.role in self.allowed_roles

class IsStudentRole(RoleBasedPermission):
    allowed_roles = ['STUDENT', 'ADMIN']
```

**Use when:** Only specific roles should access an endpoint.

### Pattern 3: Read-Only for Users, Full Access for Admins

```python
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # Anyone can read
        return request.user.is_staff  # Only admins can write
```

**Use when:** Public read data (badges, skills, certificates).

---

## 🔧 Adding New Permissions

### Step 1: Define Custom Permission Class

```python
# users/permissions.py
class MyCustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check at view level
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Check at object level
        return obj.owner == request.user
```

### Step 2: Apply to Viewset

```python
# users/views.py
from .permissions import MyCustomPermission

class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [MyCustomPermission]
    
    def get_queryset(self):
        # Filter queryset based on user
        if self.request.user.is_staff:
            return MyModel.objects.all()
        return MyModel.objects.filter(owner=self.request.user)
```

### Step 3: Test

```python
# users/tests/test_permissions.py
def test_my_permission(self):
    self.client.force_authenticate(user=self.user)
    response = self.client.get('/my-endpoint/')
    self.assertEqual(response.status_code, 200)
```

---

## 🚨 Important Notes

### 1. Always Filter Querysets
Even with permissions, **always filter querysets** in `get_queryset()`:
```python
# ✅ Good
def get_queryset(self):
    if self.request.user.is_staff:
        return Model.objects.all()
    return Model.objects.filter(user=self.request.user)

# ❌ Bad - shows all data
def get_queryset(self):
    return Model.objects.all()
```

### 2. Check Both Permission Methods
- `has_permission()` - checks if user can access the view
- `has_object_permission()` - checks if user can access specific object

### 3. Admins Should Always Pass
Always include admin/staff checks:
```python
if request.user.is_staff or request.user.role == 'ADMIN':
    return True
```

### 4. Default Permissions
Set in `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

This means **all endpoints require authentication by default**.

---

## 📚 Further Reading

- [Django Permissions Documentation](https://docs.djangoproject.com/en/stable/topics/auth/default/#permissions-and-authorization)
- [DRF Permissions Documentation](https://www.django-rest-framework.org/api-guide/permissions/)
- [DRF Authentication Documentation](https://www.django-rest-framework.org/api-guide/authentication/)

---

## ❓ FAQ

**Q: Why do I get 403 even though I'm logged in?**  
A: You might not have permission for that specific action (e.g., trying to edit when you only have read permission).

**Q: Can I bypass permissions?**  
A: Only if you're a superuser/staff. Always use proper authentication for production.

**Q: How do I test permissions in development?**  
A: Use `curl` with `-u username:password` or log in via Django admin and use the browsable API.

**Q: What's the difference between 401 and 403?**  
A: 401 = Not authenticated (no credentials), 403 = Authenticated but not authorized (insufficient permissions).

