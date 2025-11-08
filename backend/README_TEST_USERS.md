# Creating Test Users for Permission Testing

## Quick Start

The easiest way to create test users is using the Django management command:

```bash
cd backend
python manage.py create_test_users
```

## Prerequisites

1. **Activate your virtual environment** (if you're using one):
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate  # On Windows
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations** (if not already done):
   ```bash
   python manage.py migrate
   ```

## Running the Command

### Method 1: Django Management Command (Recommended)

```bash
cd backend
python manage.py create_test_users
```

This will create:
- ✅ Student user: `student@test.com` / `testpass123`
- ✅ Parent user: `parent@test.com` / `testpass123`
- ✅ Corporate Partner user: `corporate@test.com` / `testpass123`
- ✅ Admin user: `admin@test.com` / `testpass123`
- ✅ School user: `school@test.com` / `testpass123`

And create their respective profiles with relationships linked.

### Method 2: Django Shell

If the management command doesn't work, you can use Django shell:

```bash
python manage.py shell
```

Then paste this code:

```python
from users.models import User, StudentProfile, ParentProfile, CorporatePartnerProfile, AdminProfile, SchoolProfile

# Create Student User
student_user, created = User.objects.get_or_create(
    email='student@test.com',
    defaults={
        'username': 'student_test',
        'first_name': 'Test',
        'last_name': 'Student',
        'role': User.STUDENT,
        'is_verified': True,
    }
)
if created:
    student_user.set_password('testpass123')
    student_user.save()
    StudentProfile.objects.get_or_create(
        user=student_user,
        defaults={'bio': 'Test student profile'}
    )
    print(f"✅ Created student user: {student_user.email}")
else:
    student_user.set_password('testpass123')
    student_user.save()
    print(f"ℹ️  Student user already exists, password reset")

# Create Parent User
parent_user, created = User.objects.get_or_create(
    email='parent@test.com',
    defaults={
        'username': 'parent_test',
        'first_name': 'Test',
        'last_name': 'Parent',
        'role': User.PARENT,
        'is_verified': True,
    }
)
if created:
    parent_user.set_password('testpass123')
    parent_user.save()
    parent_profile, _ = ParentProfile.objects.get_or_create(user=parent_user)
    if StudentProfile.objects.filter(user=student_user).exists():
        student_profile = StudentProfile.objects.get(user=student_user)
        parent_profile.students.add(student_profile)
    print(f"✅ Created parent user: {parent_user.email}")
else:
    parent_user.set_password('testpass123')
    parent_user.save()
    print(f"ℹ️  Parent user already exists, password reset")

# Create Corporate Partner User
corporate_user, created = User.objects.get_or_create(
    email='corporate@test.com',
    defaults={
        'username': 'corporate_test',
        'first_name': 'Test',
        'last_name': 'Corporate',
        'role': User.CORPORATE_PARTNER,
        'is_verified': True,
    }
)
if created:
    corporate_user.set_password('testpass123')
    corporate_user.save()
    CorporatePartnerProfile.objects.get_or_create(
        user=corporate_user,
        defaults={
            'company_name': 'Test Company',
            'industry': 'Technology',
            'website': 'https://testcompany.com',
        }
    )
    print(f"✅ Created corporate partner user: {corporate_user.email}")
else:
    corporate_user.set_password('testpass123')
    corporate_user.save()
    print(f"ℹ️  Corporate partner user already exists, password reset")

# Create Admin User
admin_user, created = User.objects.get_or_create(
    email='admin@test.com',
    defaults={
        'username': 'admin_test',
        'first_name': 'Test',
        'last_name': 'Admin',
        'role': User.ADMIN,
        'is_staff': True,
        'is_superuser': True,
        'is_verified': True,
    }
)
if created:
    admin_user.set_password('testpass123')
    admin_user.save()
    AdminProfile.objects.get_or_create(user=admin_user)
    print(f"✅ Created admin user: {admin_user.email}")
else:
    admin_user.set_password('testpass123')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print(f"ℹ️  Admin user already exists, password reset")

# Create School User
school_user, created = User.objects.get_or_create(
    email='school@test.com',
    defaults={
        'username': 'school_test',
        'first_name': 'Test',
        'last_name': 'School',
        'role': User.SCHOOL,
        'is_verified': True,
    }
)
if created:
    school_user.set_password('testpass123')
    school_user.save()
    school_profile, _ = SchoolProfile.objects.get_or_create(
        user=school_user,
        defaults={
            'name': 'Test School',
            'address': '123 Test Street',
        }
    )
    if StudentProfile.objects.filter(user=student_user).exists():
        student_profile = StudentProfile.objects.get(user=student_user)
        student_profile.school = school_profile
        student_profile.save()
    print(f"✅ Created school user: {school_user.email}")
else:
    school_user.set_password('testpass123')
    school_user.save()
    print(f"ℹ️  School user already exists, password reset")

print("\n" + "="*50)
print("Test Users Created:")
print("="*50)
print(f"Student:   student@test.com / testpass123")
print(f"Parent:    parent@test.com / testpass123")
print(f"Corporate: corporate@test.com / testpass123")
print(f"Admin:     admin@test.com / testpass123")
print(f"School:    school@test.com / testpass123")
print("="*50)
```

### Method 3: Using Django Admin

You can also create users manually through Django admin:

1. Create a superuser (if you don't have one):
   ```bash
   python manage.py createsuperuser
   ```

2. Start the development server:
   ```bash
   python manage.py runserver
   ```

3. Go to `http://127.0.0.1:8000/admin/` and create users manually

## Verifying Users Were Created

After running the command, verify the users were created:

```bash
python manage.py shell
```

```python
from users.models import User

# Check all test users
users = User.objects.filter(email__in=[
    'student@test.com',
    'parent@test.com',
    'corporate@test.com',
    'admin@test.com',
    'school@test.com'
])

for user in users:
    print(f"{user.email} - Role: {user.role} - Verified: {user.is_verified}")
```

## Troubleshooting

### Error: "No module named 'django'"
- Make sure you've activated your virtual environment
- Install dependencies: `pip install -r requirements.txt`

### Error: "ModuleNotFoundError"
- Make sure you're in the `backend` directory when running commands
- Check that Django is installed: `pip list | grep Django`

### Error: "Command not found: create_test_users"
- Make sure the management command file exists at: `users/management/commands/create_test_users.py`
- Check that `__init__.py` files exist in `users/management/` and `users/management/commands/`

### Users exist but passwords don't work
- The script resets passwords to `testpass123` if users already exist
- If you manually changed passwords, they won't be reset
- You can manually reset in Django shell:
  ```python
  from users.models import User
  user = User.objects.get(email='student@test.com')
  user.set_password('testpass123')
  user.save()
  ```

## Test Credentials Summary

After running the script, use these credentials in Postman:

```
Student:   student@test.com / testpass123
Parent:    parent@test.com / testpass123
Corporate: corporate@test.com / testpass123
Admin:     admin@test.com / testpass123
School:    school@test.com / testpass123
```

## Next Steps

After creating test users:

1. **Import Postman Collection**: Import `AA_Educates_Permissions_Tests.postman_collection.json`
2. **Set Environment Variable**: `base_url = http://127.0.0.1:8000/api`
3. **Run Login Tests**: Login as each role to get tokens
4. **Run Permission Tests**: Test that students cannot access corporate/parent/admin endpoints

For detailed test instructions, see `POSTMAN_TEST_GUIDE.md`

