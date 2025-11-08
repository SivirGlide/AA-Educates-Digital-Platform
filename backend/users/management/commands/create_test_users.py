"""
Django management command to create test users for permission testing.

Usage:
    python manage.py create_test_users
"""

from django.core.management.base import BaseCommand
from users.models import User, StudentProfile, ParentProfile, CorporatePartnerProfile, AdminProfile, SchoolProfile


class Command(BaseCommand):
    help = 'Create test users for all roles (student, parent, corporate, admin, school)'

    def handle(self, *args, **options):
        """Create test users for all roles."""
        
        self.stdout.write(self.style.SUCCESS('Creating test users...\n'))
        
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
            self.stdout.write(self.style.SUCCESS(f'✅ Created student user: {student_user.email}'))
            
            # Create Student Profile
            StudentProfile.objects.get_or_create(
                user=student_user,
                defaults={
                    'bio': 'Test student profile',
                }
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created student profile for {student_user.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'ℹ️  Student user already exists: {student_user.email}'))
            student_user.set_password('testpass123')
            student_user.save()
            self.stdout.write(self.style.SUCCESS('   Password reset to: testpass123'))
        
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
            self.stdout.write(self.style.SUCCESS(f'✅ Created parent user: {parent_user.email}'))
            
            # Create Parent Profile
            parent_profile, _ = ParentProfile.objects.get_or_create(
                user=parent_user
            )
            # Link student to parent (if student exists)
            if StudentProfile.objects.filter(user=student_user).exists():
                student_profile = StudentProfile.objects.get(user=student_user)
                parent_profile.students.add(student_profile)
                self.stdout.write(self.style.SUCCESS('✅ Linked student to parent'))
        else:
            self.stdout.write(self.style.WARNING(f'ℹ️  Parent user already exists: {parent_user.email}'))
            parent_user.set_password('testpass123')
            parent_user.save()
            self.stdout.write(self.style.SUCCESS('   Password reset to: testpass123'))
        
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
            self.stdout.write(self.style.SUCCESS(f'✅ Created corporate partner user: {corporate_user.email}'))
            
            # Create Corporate Partner Profile
            CorporatePartnerProfile.objects.get_or_create(
                user=corporate_user,
                defaults={
                    'company_name': 'Test Company',
                    'industry': 'Technology',
                    'website': 'https://testcompany.com',
                }
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created corporate partner profile for {corporate_user.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'ℹ️  Corporate partner user already exists: {corporate_user.email}'))
            corporate_user.set_password('testpass123')
            corporate_user.save()
            self.stdout.write(self.style.SUCCESS('   Password reset to: testpass123'))
        
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
            self.stdout.write(self.style.SUCCESS(f'✅ Created admin user: {admin_user.email}'))
            
            # Create Admin Profile
            AdminProfile.objects.get_or_create(user=admin_user)
            self.stdout.write(self.style.SUCCESS(f'✅ Created admin profile for {admin_user.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'ℹ️  Admin user already exists: {admin_user.email}'))
            admin_user.set_password('testpass123')
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('   Password reset to: testpass123'))
        
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
            self.stdout.write(self.style.SUCCESS(f'✅ Created school user: {school_user.email}'))
            
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
                self.stdout.write(self.style.SUCCESS('✅ Linked student to school'))
        else:
            self.stdout.write(self.style.WARNING(f'ℹ️  School user already exists: {school_user.email}'))
            school_user.set_password('testpass123')
            school_user.save()
            self.stdout.write(self.style.SUCCESS('   Password reset to: testpass123'))
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Test Users Summary:'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS(f'Student:   {student_user.email} / testpass123'))
        self.stdout.write(self.style.SUCCESS(f'Parent:    {parent_user.email} / testpass123'))
        self.stdout.write(self.style.SUCCESS(f'Corporate: {corporate_user.email} / testpass123'))
        self.stdout.write(self.style.SUCCESS(f'Admin:     {admin_user.email} / testpass123'))
        self.stdout.write(self.style.SUCCESS(f'School:    {school_user.email} / testpass123'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\n✅ All test users are ready!'))
        self.stdout.write(self.style.SUCCESS('You can now use these credentials in Postman tests.'))

