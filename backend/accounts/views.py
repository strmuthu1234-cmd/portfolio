from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from config.permissions import IsAdminUser


class AdminTokenSerializer(TokenObtainPairSerializer):
    """Only staff accounts may obtain admin-dashboard tokens."""

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise serializers.ValidationError(
                {"detail": "This account does not have admin access."}
            )
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "is_staff": self.user.is_staff,
        }
        return data


class LoginView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer
    throttle_scope = "login"


class RefreshView(TokenRefreshView):
    throttle_scope = "login"


class MeView(APIView):
    permission_classes = [IsAdminUser]

    @extend_schema(responses=OpenApiTypes.OBJECT)
    def get(self, request):
        user = request.user
        return Response(
            {"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff}
        )
