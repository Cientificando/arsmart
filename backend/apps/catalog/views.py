from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import BusinessArea, Service, ServiceCategory
from .serializers import (
    BusinessAreaSerializer,
    ServiceCategorySerializer,
    ServiceDetailSerializer,
    ServiceListSerializer,
)


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.filter(is_active=True)
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related("category")
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category__slug", "is_featured"]
    search_fields = ["name", "short_description", "full_description"]
    ordering_fields = ["order", "name", "created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ServiceListSerializer
        return ServiceDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return Service.objects.all().select_related("category")
        return qs


class BusinessAreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BusinessArea.objects.exclude(status=BusinessArea.Status.INACTIVE)
    serializer_class = BusinessAreaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ["status"]
