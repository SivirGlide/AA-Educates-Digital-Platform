from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from users.models import StudentProfile, ParentProfile, CorporatePartnerProfile

User = get_user_model()


class UserPermissionsTestCase(TestCase):
    def setUp(self):
        """Create test users."""
        self.client = APIClient()
        
        # Create admin user
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            role=User.ADMIN,
            is_staff=True,
            is_superuser=True
        )
        
        # Create student user
        self.student = User.objects.create_user(
            username='student',
            email='student@test.com',
            password='student123',
            role=User.STUDENT
        )
        StudentProfile.objects.create(user=self.student)
        
        # Create another student
        self.student2 = User.objects.create_user(
            username='student2',
            email='student2@test.com',
            password='student123',
            role=User.STUDENT
        )
        StudentProfile.objects.create(user=self.student2)
        
        # Create parent
        self.parent = User.objects.create_user(
            username='parent',
            email='parent@test.com',
            password='parent123',
            role=User.PARENT
        )
        parent_profile = ParentProfile.objects.create(user=self.parent)
        parent_profile.students.add(self.student.student_profile)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access."""
        response = self.client.get('/users/users/')
        # DRF returns 401 or 403 depending on authentication classes configured
        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
            f"Expected 401 or 403, got {response.status_code}: {response.data}"
        )

    def test_student_sees_own_profile(self):
        """Test that students can only see their own profile."""
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/users/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return own user
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.student.id)

    def test_admin_sees_all_users(self):
        """Test that admin can see all users."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/users/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return multiple users
        self.assertGreater(len(response.data), 1)

    def test_student_cannot_access_other_student_profile(self):
        """Test that students cannot access other students' profiles."""
        self.client.force_authenticate(user=self.student)
        response = self.client.get(f'/users/users/{self.student2.id}/')
        # Should be filtered out or return 403
        self.assertIn(response.status_code, [status.HTTP_404_NOT_FOUND, status.HTTP_403_FORBIDDEN])

    def test_parent_sees_linked_students(self):
        """Test that parents can see their linked students."""
        self.client.force_authenticate(user=self.parent)
        response = self.client.get('/users/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see linked student
        student_ids = [s['user'] for s in response.data]
        self.assertIn(self.student.id, student_ids)

    def test_me_endpoint(self):
        """Test the /me/ endpoint returns current user."""
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/users/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.student.id)
        self.assertEqual(response.data['email'], self.student.email)

