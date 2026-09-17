from rest_framework import serializers

from .models import ProcurementDetail, QuoteRequest, QuoteRequestHistory


class QuoteRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer usado pelo formulário público de 'Solicitar orçamento'."""

    class Meta:
        model = QuoteRequest
        fields = [
            "customer_name", "company_name", "email", "phone", "whatsapp",
            "request_type", "service", "software", "product_category",
            "subject", "description", "quantity", "budget", "location",
            "deadline", "attachment", "privacy_consent",
        ]

    def validate_privacy_consent(self, value):
        if not value:
            raise serializers.ValidationError("É necessário aceitar a política de privacidade.")
        return value

    def validate(self, attrs):
        request_type = attrs.get("request_type")
        if request_type == QuoteRequest.RequestType.SERVICE and not attrs.get("service"):
            raise serializers.ValidationError({"service": "Seleccione o serviço pretendido."})
        if request_type in (QuoteRequest.RequestType.SOFTWARE, QuoteRequest.RequestType.DEMO) and not attrs.get("software"):
            raise serializers.ValidationError({"software": "Seleccione a solução de software pretendida."})
        return attrs


class QuoteRequestHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = QuoteRequestHistory
        fields = ["id", "old_status", "new_status", "comment", "changed_by", "created_at"]


class ProcurementDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcurementDetail
        fields = [
            "withdrawal_order_number", "withdrawal_order_date", "withdrawal_amount",
            "supplier", "procurement_notes", "procurement_status",
        ]


class QuoteRequestAdminSerializer(serializers.ModelSerializer):
    """Serializer completo para o backoffice (inclui notas internas e histórico)."""

    history = QuoteRequestHistorySerializer(many=True, read_only=True)
    procurement_detail = ProcurementDetailSerializer(read_only=True)

    class Meta:
        model = QuoteRequest
        fields = "__all__"
        read_only_fields = ["reference", "created_at", "updated_at"]


class QuoteRequestStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=QuoteRequest.Status.choices)
    comment = serializers.CharField(required=False, allow_blank=True)
