from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AdminAuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="editor", password="StrongPass#123", role=User.Role.EDITOR
        )

    def test_login_success(self):
        response = self.client.post(
            "/api/v1/auth/login/", {"username": "editor", "password": "StrongPass#123"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_login_wrong_password_fails(self):
        response = self.client.post(
            "/api/v1/auth/login/", {"username": "editor", "password": "wrong"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_superuser_gets_superadmin_role(self):
        admin = User.objects.create_superuser(username="root", email="r@r.com", password="StrongPass#123")
        self.assertEqual(admin.role, User.Role.SUPERADMIN)
