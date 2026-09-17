from rest_framework.routers import DefaultRouter

from .views import ContactMessageAdminViewSet, ContactMessagePublicViewSet

router = DefaultRouter()
router.register("contact", ContactMessagePublicViewSet, basename="contact")
router.register("admin/contact-messages", ContactMessageAdminViewSet, basename="admin-contact-message")

urlpatterns = router.urls
