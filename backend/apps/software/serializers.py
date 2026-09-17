from rest_framework import serializers

from .models import SoftwareScreenshot, SoftwareSolution


class SoftwareScreenshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareScreenshot
        fields = ["id", "image", "caption", "order"]


class SoftwareListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareSolution
        fields = ["id", "name", "slug", "developer", "category", "short_description", "cover_image", "is_featured"]


class SoftwareDetailSerializer(serializers.ModelSerializer):
    screenshots = SoftwareScreenshotSerializer(many=True, read_only=True)
    features_list = serializers.SerializerMethodField()
    benefits_list = serializers.SerializerMethodField()
    license_type_display = serializers.CharField(source="get_license_type_display", read_only=True)

    class Meta:
        model = SoftwareSolution
        fields = [
            "id", "name", "slug", "developer", "category", "short_description", "full_description",
            "features_list", "benefits_list", "target_audience", "requirements",
            "license_type", "license_type_display", "price_note", "documentation_url",
            "video_url", "cover_image", "screenshots", "is_featured",
        ]

    def get_features_list(self, obj):
        return [line.strip() for line in obj.features.splitlines() if line.strip()]

    def get_benefits_list(self, obj):
        return [line.strip() for line in obj.benefits.splitlines() if line.strip()]
