from rest_framework import status
from rest_framework.test import APITestCase

from apps.contacts.models import ContactMessage


class ContactFormTests(APITestCase):
    def test_contact_message_creation(self):
        payload = {
            "name": "Visitante", "email": "v@example.com", "subject": "Dúvida",
            "message": "Gostaria de mais informações.", "privacy_consent": True,
        }
        response = self.client.post("/api/v1/contact/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_contact_requires_consent(self):
        payload = {
            "name": "Visitante", "email": "v@example.com", "subject": "Dúvida",
            "message": "x", "privacy_consent": False,
        }
        response = self.client.post("/api/v1/contact/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
