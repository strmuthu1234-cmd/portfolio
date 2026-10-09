from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "company", "subject", "message", "created_at", "is_read"]
        read_only_fields = ["id", "created_at"]

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value.strip()


class ContactCreateSerializer(ContactMessageSerializer):
    """Public submission: visitors cannot set `is_read`."""

    class Meta(ContactMessageSerializer.Meta):
        read_only_fields = ["id", "created_at", "is_read"]
