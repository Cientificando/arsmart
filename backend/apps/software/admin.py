from django.contrib import admin
from django.utils.html import format_html

from .models import SoftwareScreenshot, SoftwareSolution


class SoftwareScreenshotInline(admin.TabularInline):
    model = SoftwareScreenshot
    extra = 1


@admin.register(SoftwareSolution)
class SoftwareSolutionAdmin(admin.ModelAdmin):
    list_display = ("name", "developer", "license_type", "is_featured", "is_active", "order", "cover_preview")
    list_editable = ("is_featured", "is_active", "order")
    list_filter = ("license_type", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [SoftwareScreenshotInline]
    readonly_fields = ("cover_preview",)
    fieldsets = (
        ("Identificação", {"fields": ("name", "slug", "developer", "category", "cover_image", "cover_preview")}),
        ("Conteúdo", {
            "fields": (
                "short_description", "full_description", "features", "benefits",
                "target_audience", "requirements",
            )
        }),
        ("Comercial", {"fields": ("license_type", "price_note", "documentation_url", "video_url")}),
        ("Apresentação", {"fields": ("is_featured", "is_active", "order")}),
    )

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="max-height:60px" />', obj.cover_image.url)
        return "—"
    cover_preview.short_description = "Pré-visualização"
