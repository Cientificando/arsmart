from django.contrib import admin

from .models import Project, ProjectCategory


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "is_featured", "date", "order")
    list_editable = ("is_featured", "order")
    list_filter = ("status", "category", "is_featured")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("services_involved",)
