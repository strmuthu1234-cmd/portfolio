from django.db import models
from django.utils.text import slugify


class Project(models.Model):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True, help_text="List of technology names")
    features = models.JSONField(default=list, blank=True, help_text="List of feature strings")
    architecture = models.JSONField(
        default=list,
        blank=True,
        help_text='List of flows: [{"title": "...", "steps": ["...", "..."]}]',
    )
    thumbnail = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or "project"
            slug, n = base, 2
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug, n = f"{base}-{n}", n + 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
