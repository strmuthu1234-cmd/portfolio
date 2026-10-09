from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from config.permissions import IsAdminUser

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """Employee CRUD demo. Public when EMPLOYEE_DEMO_PUBLIC=True, else admin JWT."""

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filterset_fields = ["department", "status"]
    search_fields = ["name", "email", "designation"]
    ordering_fields = ["name", "join_date", "department"]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_permissions(self):
        return [AllowAny()] if settings.EMPLOYEE_DEMO_PUBLIC else [IsAdminUser()]
