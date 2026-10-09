from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from config.permissions import IsAdminOrReadOnly

from .models import Project
from .serializers import ProjectListSerializer, ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """Public read, admin write. Detail lookups use the project slug."""

    queryset = Project.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_field = "slug"
    filterset_fields = ["featured"]
    search_fields = ["title", "short_description"]
    ordering_fields = ["order", "created_at", "title"]

    def get_serializer_class(self):
        return ProjectListSerializer if self.action == "list" else ProjectSerializer
