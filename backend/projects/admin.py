from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "featured", "order", "updated_at")
    list_editable = ("featured", "order")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)
