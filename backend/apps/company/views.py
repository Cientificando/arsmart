from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import FAQ, CompanyProfile, TeamMember, Testimonial
from .serializers import CompanyProfileSerializer, FAQSerializer, TeamMemberSerializer, TestimonialSerializer


class CompanyProfileView(RetrieveAPIView):
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj, _ = CompanyProfile.objects.get_or_create(pk=1)
        return obj


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_published=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_published=True)
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
