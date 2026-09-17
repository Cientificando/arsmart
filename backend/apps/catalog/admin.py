from django.contrib import admin
from django.utils.html import format_html

from .models import BusinessArea, Service, ServiceCategory


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "order")
    list_editable = ("is_active", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_featured", "is_active", "order", "image_preview")
    list_editable = ("is_featured", "is_active", "order")
    list_filter = ("category", "is_active", "is_featured")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_description")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:40px" />', obj.image.url)
        return "—"
    image_preview.short_description = "Imagem"


@admin.register(BusinessArea)
class BusinessAreaAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "is_active", "order", "image_preview")
    list_editable = ("status", "is_active", "order")
    list_filter = ("status",)
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:40px" />', obj.image.url)
        return "—"
    image_preview.short_description = "Imagem"

