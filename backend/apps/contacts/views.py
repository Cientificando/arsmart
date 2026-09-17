from rest_framework import mixins, status, viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import ContactMessage
from .serializers import ContactMessageAdminSerializer, ContactMessageCreateSerializer


class ContactMessagePublicViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer
    permission_classes = []
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Mensagem enviada com sucesso."}, status=status.HTTP_201_CREATED)


class ContactMessageAdminViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ["is_read"]
    search_fields = ["name", "email", "subject"]
    ordering_fields = ["created_at"]
