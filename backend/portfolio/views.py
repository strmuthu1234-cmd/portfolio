from rest_framework import mixins, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from config.permissions import IsAdminOrReadOnly, IsAdminUser

from .models import Experience, MediaAsset, Skill
from .serializers import ExperienceSerializer, MediaAssetSerializer, SkillSerializer


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["category"]
    search_fields = ["name"]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["is_current"]


class MediaAssetViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Admin-only image uploads (local disk or S3)."""

    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
