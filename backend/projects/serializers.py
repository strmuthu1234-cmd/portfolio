import json

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Project


@extend_schema_field({"type": "array", "items": {}})
class JSONListField(serializers.Field):
    """List field that also accepts a JSON string (needed for multipart uploads)."""

    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except ValueError:
                raise serializers.ValidationError("Must be a valid JSON list.")
        if not isinstance(data, list):
            raise serializers.ValidationError("Must be a list.")
        return data

    def to_representation(self, value):
        return value


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack = JSONListField(required=False)
    features = JSONListField(required=False)
    architecture = JSONListField(required=False)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "full_description",
            "tech_stack", "features", "architecture", "thumbnail",
            "github_url", "live_url", "featured", "order", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def validate_tech_stack(self, value):
        if not all(isinstance(v, str) for v in value):
            raise serializers.ValidationError("Each tech stack item must be a string.")
        return value

    def validate_features(self, value):
        if not all(isinstance(v, str) for v in value):
            raise serializers.ValidationError("Each feature must be a string.")
        return value

    def validate_architecture(self, value):
        for flow in value:
            if not (
                isinstance(flow, dict)
                and isinstance(flow.get("title"), str)
                and isinstance(flow.get("steps"), list)
            ):
                raise serializers.ValidationError(
                    'Each flow must look like {"title": str, "steps": [str, ...]}.'
                )
        return value


class ProjectListSerializer(ProjectSerializer):
    """Lighter payload for list views."""

    class Meta(ProjectSerializer.Meta):
        fields = [
            "id", "title", "slug", "short_description", "tech_stack",
            "thumbnail", "github_url", "live_url", "featured", "order",
        ]
