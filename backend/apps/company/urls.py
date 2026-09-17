from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CompanyProfileView, FAQViewSet, TeamMemberViewSet, TestimonialViewSet

router = DefaultRouter()
router.register("faqs", FAQViewSet, basename="faq")
router.register("team", TeamMemberViewSet, basename="team")
router.register("testimonials", TestimonialViewSet, basename="testimonial")

urlpatterns = [
    path("company/", CompanyProfileView.as_view(), name="company-profile"),
] + router.urls
