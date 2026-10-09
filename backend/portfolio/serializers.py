from rest_framework import serializers

from .models import Experience, MediaAsset, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "category", "proficiency", "icon"]

    def validate_proficiency(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError("Proficiency must be between 0 and 100.")
        return value


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "company", "role", "start_date", "end_date", "description", "is_current"]

    def validate(self, attrs):
        start = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end = attrs.get("end_date", getattr(self.instance, "end_date", None))
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date cannot be before start date."})
        return attrs


class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = ["id", "title", "file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]
