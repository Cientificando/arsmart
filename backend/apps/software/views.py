from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import SoftwareSolution
from .serializers import SoftwareDetailSerializer, SoftwareListSerializer


class SoftwareViewSet(viewsets.ModelViewSet):
    queryset = SoftwareSolution.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    search_fields = ["name", "short_description", "full_description"]
    ordering_fields = ["order", "name"]

    def get_serializer_class(self):
        if self.action == "list":
            return SoftwareListSerializer
        return SoftwareDetailSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return SoftwareSolution.objects.all()
        return super().get_queryset()
