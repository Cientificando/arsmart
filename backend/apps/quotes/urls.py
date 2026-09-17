from rest_framework.routers import DefaultRouter

from .views import QuoteRequestAdminViewSet, QuoteRequestPublicViewSet

router = DefaultRouter()
router.register("quote-requests", QuoteRequestPublicViewSet, basename="quote-request")
router.register("admin/quote-requests", QuoteRequestAdminViewSet, basename="admin-quote-request")

urlpatterns = router.urls
