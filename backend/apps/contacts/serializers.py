from rest_framework import serializers

from .models import ContactMessage


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message", "privacy_consent"]

    def validate_privacy_consent(self, value):
        if not value:
            raise serializers.ValidationError("É necessário aceitar a política de privacidade.")
        return value


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
