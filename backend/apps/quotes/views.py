from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import QuoteRequest
from .serializers import (
    QuoteRequestAdminSerializer,
    QuoteRequestCreateSerializer,
    QuoteRequestStatusUpdateSerializer,
)


class QuoteRequestPublicViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Endpoint público — apenas criação (POST). Qualquer visitante pode
    submeter um pedido; a consulta/gestão fica reservada ao backoffice.
    """

    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestCreateSerializer
    permission_classes = []  # AllowAny — pedido comercial público
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(
            {"reference": instance.reference, "message": "Pedido recebido com sucesso."},
            status=status.HTTP_201_CREATED,
        )


class QuoteRequestAdminViewSet(viewsets.ModelViewSet):
    """CRUD e gestão de estado — apenas utilizadores autenticados do backoffice."""

    queryset = QuoteRequest.objects.select_related(
        "service", "software", "product_category", "assigned_to"
    ).prefetch_related("history")
    serializer_class = QuoteRequestAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ["status", "request_type", "priority"]
    search_fields = ["reference", "customer_name", "company_name", "email"]
    ordering_fields = ["created_at", "status", "priority"]

    @action(detail=True, methods=["post"], url_path="change-status")
    def change_status(self, request, pk=None):
        instance = self.get_object()
        serializer = QuoteRequestStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.change_status(
            new_status=serializer.validated_data["status"],
            changed_by=request.user,
            comment=serializer.validated_data.get("comment", ""),
        )
        return Response(QuoteRequestAdminSerializer(instance).data)
