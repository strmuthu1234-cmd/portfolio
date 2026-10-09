import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from config.permissions import IsAdminUser

from .models import ContactMessage
from .serializers import ContactCreateSerializer, ContactMessageSerializer

logger = logging.getLogger(__name__)


def notify_owner(msg):
    """Optional email notification, enabled via CONTACT_NOTIFY_ENABLED."""
    if not (settings.CONTACT_NOTIFY_ENABLED and settings.CONTACT_NOTIFY_TO):
        return
    try:
        send_mail(
            subject=f"[Portfolio] {msg.subject}",
            message=f"From: {msg.name} <{msg.email}>\nCompany: {msg.company or '-'}\n\n{msg.message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=settings.CONTACT_NOTIFY_TO,
        )
    except Exception:  # never fail the submission because email is down
        logger.exception("Contact notification email failed")


class ContactMessageViewSet(viewsets.ModelViewSet):
    """Public can POST; everything else is admin only."""

    queryset = ContactMessage.objects.all()
    filterset_fields = ["is_read"]
    search_fields = ["name", "email", "subject", "company"]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "contact"
            return super().get_throttles()
        return []

    def get_serializer_class(self):
        return ContactCreateSerializer if self.action == "create" else ContactMessageSerializer

    def perform_create(self, serializer):
        notify_owner(serializer.save())
