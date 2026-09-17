from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Project, ProjectCategory
from .serializers import ProjectCategorySerializer, ProjectDetailSerializer, ProjectListSerializer


class ProjectCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.filter(status=Project.Status.PUBLISHED)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category__slug", "is_featured"]
    search_fields = ["name", "description"]
    ordering_fields = ["order", "date"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Project.objects.all()
        return super().get_queryset()
