from rest_framework import serializers

from .models import BusinessArea, Service, ServiceCategory


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "slug", "description", "order"]


class ServiceListSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = ["id", "name", "slug", "category", "short_description", "image", "is_featured", "order"]


class ServiceDetailSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    benefits_list = serializers.SerializerMethodField()
    process_list = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "category", "short_description", "full_description",
            "benefits_list", "process_list", "image", "cta_label", "is_featured",
        ]

    def get_benefits_list(self, obj):
        return [line.strip() for line in obj.benefits.splitlines() if line.strip()]

    def get_process_list(self, obj):
        return [line.strip() for line in obj.process.splitlines() if line.strip()]


class BusinessAreaSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = BusinessArea
        fields = ["id", "name", "slug", "description", "status", "status_display", "order"]
