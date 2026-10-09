from django.db import models


class Skill(models.Model):
    class Category(models.TextChoices):
        FRONTEND = "frontend", "Frontend"
        BACKEND = "backend", "Backend"
        DATABASE = "database", "Database"
        CLOUD_TOOLS = "cloud_tools", "Cloud / DevOps / Tools"
        AUTOMATION_AI = "automation_ai", "Automation & AI"
        CORE = "core", "Core Concepts"

    name = models.CharField(max_length=80)
    category = models.CharField(max_length=20, choices=Category.choices)
    proficiency = models.PositiveSmallIntegerField(default=70, help_text="0-100")
    icon = models.CharField(max_length=60, blank=True)

    class Meta:
        ordering = ["category", "-proficiency", "name"]
        unique_together = [("name", "category")]

    def __str__(self):
        return f"{self.name} ({self.category})"


class Experience(models.Model):
    company = models.CharField(max_length=160)
    role = models.CharField(max_length=160)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, help_text="One responsibility per line")
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.role} @ {self.company}"


class MediaAsset(models.Model):
    """Uploaded images/assets (stored on local disk or AWS S3)."""

    title = models.CharField(max_length=160, blank=True)
    file = models.ImageField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title or self.file.name
