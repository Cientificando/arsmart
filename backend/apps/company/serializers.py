from rest_framework import serializers

from .models import FAQ, CompanyProfile, CompanyValue, SocialLink, TeamMember, Testimonial


class CompanyValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyValue
        fields = ["id", "name", "description", "order"]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["id", "name", "role", "bio", "photo", "linkedin_url", "order"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "author_name", "author_role", "company_name", "content", "order"]


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["platform", "url"]


class CompanyProfileSerializer(serializers.ModelSerializer):
    social_links = serializers.SerializerMethodField()
    values_list = serializers.SerializerMethodField()

    class Meta:
        model = CompanyProfile
        fields = [
            "legal_name", "trade_name", "nif", "registration_number", "legal_form",
            "founded_year", "capital", "address", "province", "municipality", "country",
            "phone", "email", "whatsapp", "website", "description", "mission", "vision",
            "values_list", "logo", "favicon", "google_maps_url", "social_links",
        ]

    def get_social_links(self, obj):
        return SocialLinkSerializer(SocialLink.objects.filter(is_active=True), many=True).data

    def get_values_list(self, obj):
        structured = CompanyValue.objects.all()
        if structured.exists():
            return CompanyValueSerializer(structured, many=True).data
        return [{"name": line.strip(), "description": ""} for line in obj.values.splitlines() if line.strip()]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order"]
