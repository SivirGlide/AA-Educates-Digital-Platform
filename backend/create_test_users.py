"""
Script to create test users for permission testing.

METHOD 1 (Recommended): Use Django management command
    python manage.py create_test_users

METHOD 2: Run via Django shell
    python manage.py shell
    Then copy-paste the function code below.

METHOD 3: Run this script directly (if Django is configured)
    python create_test_users.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Add parent directory to path if running directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    print("\nPlease use one of these methods instead:")
    print("1. python manage.py create_test_users (Recommended)")
    print("2. python manage.py shell, then run the function")
    sys.exit(1)

from users.models import User, StudentProfile, ParentProfile, CorporatePartnerProfile, AdminProfile, SchoolProfile

def create_test_users():
    """Create test users for all roles."""
    
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
        print(f"✅ Created student user: {student_user.email}")
        
        # Create Student Profile
        StudentProfile.objects.get_or_create(
            user=student_user,
            defaults={
                'bio': 'Test student profile',
            }
        )
        print(f"✅ Created student profile for {student_user.email}")
    else:
        print(f"ℹ️  Student user already exists: {student_user.email}")
        student_user.set_password('testpass123')
        student_user.save()
    
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
        print(f"✅ Created parent user: {parent_user.email}")
        
        # Create Parent Profile
        parent_profile, _ = ParentProfile.objects.get_or_create(
            user=parent_user
        )
        # Link student to parent (if student exists)
        if StudentProfile.objects.filter(user=student_user).exists():
            student_profile = StudentProfile.objects.get(user=student_user)
            parent_profile.students.add(student_profile)
            print(f"✅ Linked student to parent")
    else:
        print(f"ℹ️  Parent user already exists: {parent_user.email}")
        parent_user.set_password('testpass123')
        parent_user.save()
    
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
        print(f"✅ Created corporate partner user: {corporate_user.email}")
        
        # Create Corporate Partner Profile
        CorporatePartnerProfile.objects.get_or_create(
            user=corporate_user,
            defaults={
                'company_name': 'Test Company',
                'industry': 'Technology',
                'website': 'https://testcompany.com',
            }
        )
        print(f"✅ Created corporate partner profile for {corporate_user.email}")
    else:
        print(f"ℹ️  Corporate partner user already exists: {corporate_user.email}")
        corporate_user.set_password('testpass123')
        corporate_user.save()
    
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
        print(f"✅ Created admin user: {admin_user.email}")
        
        # Create Admin Profile
        AdminProfile.objects.get_or_create(user=admin_user)
        print(f"✅ Created admin profile for {admin_user.email}")
    else:
        print(f"ℹ️  Admin user already exists: {admin_user.email}")
        admin_user.set_password('testpass123')
        admin_user.save()
    
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
        print(f"✅ Created school user: {school_user.email}")
        
        # Create School Profile
        school_profile, _ = SchoolProfile.objects.get_or_create(
            user=school_user,
            defaults={
                'name': 'Test School',
                'address': '123 Test Street',
            }
        )
        # Link student to school (if student exists)
        if StudentProfile.objects.filter(user=student_user).exists():
            student_profile = StudentProfile.objects.get(user=student_user)
            student_profile.school = school_profile
            student_profile.save()
            print(f"✅ Linked student to school")
    else:
        print(f"ℹ️  School user already exists: {school_user.email}")
        school_user.set_password('testpass123')
        school_user.save()
    
    print("\n" + "="*50)
    print("Test Users Summary:")
    print("="*50)
    print(f"Student:   {student_user.email} / testpass123")
    print(f"Parent:    {parent_user.email} / testpass123")
    print(f"Corporate: {corporate_user.email} / testpass123")
    print(f"Admin:     {admin_user.email} / testpass123")
    print(f"School:    {school_user.email} / testpass123")
    print("="*50)
    print("\n✅ All test users are ready!")
    print("You can now use these credentials in Postman tests.")

if __name__ == '__main__':
    create_test_users()

