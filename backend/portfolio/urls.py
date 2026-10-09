from rest_framework.routers import DefaultRouter

from .views import ExperienceViewSet, MediaAssetViewSet, SkillViewSet

router = DefaultRouter()
router.register("skills", SkillViewSet, basename="skill")
router.register("experience", ExperienceViewSet, basename="experience")
router.register("media", MediaAssetViewSet, basename="media")

urlpatterns = router.urls
