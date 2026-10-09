from django.db import models


class Employee(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ON_LEAVE = "on_leave", "On Leave"
        INACTIVE = "inactive", "Inactive"

    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=80)
    designation = models.CharField(max_length=80)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    join_date = models.DateField()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
