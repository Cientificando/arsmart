from rest_framework.routers import DefaultRouter

from .views import ProjectCategoryViewSet, ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("project-categories", ProjectCategoryViewSet, basename="project-category")

urlpatterns = router.urls
