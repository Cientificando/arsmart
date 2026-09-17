from rest_framework import serializers

from .models import Project, ProjectCategory


class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ["id", "name", "slug"]


class ProjectListSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "slug", "category", "client_name", "image", "date", "location", "is_featured"]


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    services_involved = serializers.SlugRelatedField(many=True, read_only=True, slug_field="slug")

    class Meta:
        model = Project
        fields = [
            "id", "name", "slug", "category", "client_name", "description", "image",
            "date", "location", "services_involved", "results", "is_featured",
        ]
