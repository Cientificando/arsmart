from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Service, ServiceCategory


class ServiceCatalogTests(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name="Consultoria")
        self.service = Service.objects.create(
            category=self.category, name="Consultoria Empresarial",
            short_description="Curta", full_description="Completa",
            is_active=True,
        )
        self.inactive_service = Service.objects.create(
            category=self.category, name="Serviço Inactivo",
            short_description="x", full_description="x", is_active=False,
        )

    def test_public_list_only_shows_active_services(self):
        response = self.client.get("/api/v1/services/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [item["name"] for item in response.data["results"]]
        self.assertIn("Consultoria Empresarial", names)
        self.assertNotIn("Serviço Inactivo", names)

    def test_service_detail_by_slug(self):
        response = self.client.get(f"/api/v1/services/{self.service.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Consultoria Empresarial")
