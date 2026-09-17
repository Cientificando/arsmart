from rest_framework.routers import DefaultRouter

from .views import BusinessAreaViewSet, ServiceCategoryViewSet, ServiceViewSet

router = DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("service-categories", ServiceCategoryViewSet, basename="service-category")
router.register("business-areas", BusinessAreaViewSet, basename="business-area")

urlpatterns = router.urls
