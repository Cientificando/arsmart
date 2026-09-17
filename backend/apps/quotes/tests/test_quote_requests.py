from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Service, ServiceCategory
from apps.quotes.models import QuoteRequest

User = get_user_model()


class QuoteRequestFlowTests(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name="Tecnologia")
        self.service = Service.objects.create(
            category=self.category,
            name="Serviços de Informática",
            short_description="Apoio informático.",
            full_description="Apoio informático completo.",
        )
        self.admin = User.objects.create_superuser(username="admin", email="a@a.com", password="StrongPass#123")

    def test_create_quote_request_generates_reference(self):
        payload = {
            "customer_name": "Cliente A", "email": "a@example.com",
            "request_type": "SERVICE", "service": self.service.id,
            "subject": "Preciso de apoio", "description": "Descrição do pedido",
            "privacy_consent": True,
        }
        response = self.client.post("/api/v1/quote-requests/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["reference"].startswith("REQ-"))

    def test_create_quote_request_without_consent_fails(self):
        payload = {
            "customer_name": "Cliente B", "email": "b@example.com",
            "request_type": "OTHER", "subject": "x", "description": "x",
            "privacy_consent": False,
        }
        response = self.client.post("/api/v1/quote-requests/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_service_request_without_service_fails(self):
        payload = {
            "customer_name": "Cliente C", "email": "c@example.com",
            "request_type": "SERVICE", "subject": "x", "description": "x",
            "privacy_consent": True,
        }
        response = self.client.post("/api/v1/quote-requests/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_references_increment_sequentially(self):
        payload = lambda name: {
            "customer_name": name, "email": f"{name}@example.com",
            "request_type": "CONSULTING", "subject": "x", "description": "x",
            "privacy_consent": True,
        }
        r1 = self.client.post("/api/v1/quote-requests/", payload("um"))
        r2 = self.client.post("/api/v1/quote-requests/", payload("dois"))
        num1 = int(r1.data["reference"].rsplit("-", 1)[-1])
        num2 = int(r2.data["reference"].rsplit("-", 1)[-1])
        self.assertEqual(num2, num1 + 1)

    def test_anonymous_cannot_list_or_manage_requests(self):
        response = self.client.get("/api/v1/admin/quote-requests/")
        self.assertIn(response.status_code, (401, 403))

    def test_admin_can_change_status_and_history_is_recorded(self):
        qr = QuoteRequest.objects.create(
            customer_name="Cliente D", email="d@example.com", request_type="OTHER",
            subject="x", description="x", privacy_consent=True,
        )
        self.client.force_authenticate(self.admin)
        url = f"/api/v1/admin/quote-requests/{qr.id}/change-status/"
        response = self.client.post(url, {"status": "UNDER_REVIEW", "comment": "A analisar"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        qr.refresh_from_db()
        self.assertEqual(qr.status, "UNDER_REVIEW")
        self.assertEqual(qr.history.count(), 1)
        self.assertEqual(qr.history.first().new_status, "UNDER_REVIEW")

    def test_admin_can_list_requests(self):
        QuoteRequest.objects.create(
            customer_name="Cliente E", email="e@example.com", request_type="OTHER",
            subject="x", description="x", privacy_consent=True,
        )
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/v1/admin/quote-requests/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["count"], 1)

    def test_demo_request_requires_software(self):
        payload = {
            "customer_name": "Cliente F", "email": "f@example.com",
            "request_type": "DEMO", "subject": "Demonstração", "description": "x",
            "privacy_consent": True,
        }
        response = self.client.post("/api/v1/quote-requests/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_supply_request_without_category_succeeds(self):
        payload = {
            "customer_name": "Cliente G", "email": "g@example.com",
            "request_type": "SUPPLY", "subject": "10 portáteis", "description": "10 portáteis",
            "privacy_consent": True,
        }
        response = self.client.post("/api/v1/quote-requests/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
