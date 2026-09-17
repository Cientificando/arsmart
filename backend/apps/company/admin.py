from django.contrib import admin
from django.utils.html import format_html

from .models import FAQ, CompanyProfile, CompanyValue, SocialLink, SiteSetting, TeamMember, Testimonial


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identificação Legal", {
            "fields": ("legal_name", "trade_name", "nif", "registration_number", "legal_form", "founded_year", "capital")
        }),
        ("Morada", {"fields": ("address", "province", "municipality", "country", "google_maps_url")}),
        ("Contactos", {"fields": ("phone", "email", "whatsapp", "website")}),
        ("Institucional", {"fields": ("description", "mission", "vision", "values")}),
        ("Identidade Visual", {"fields": ("logo", "favicon")}),
    )
    readonly_fields = ("logo_preview",)

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height:60px" />', obj.logo.url)
        return "—"

    def has_add_permission(self, request):
        return not CompanyProfile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CompanyValue)
class CompanyValueAdmin(admin.ModelAdmin):
    list_display = ("name", "order")
    list_editable = ("order",)


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "url", "is_active", "order")
    list_editable = ("is_active", "order")


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "value", "description")
    search_fields = ("key",)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_active", "order")
    list_editable = ("is_active", "order")
    search_fields = ("question",)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "is_published", "order", "photo_preview")
    list_editable = ("is_published", "order")
    readonly_fields = ("photo_preview",)

    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="max-height:40px;border-radius:50%" />', obj.photo.url)
        return "—"
    photo_preview.short_description = "Foto"


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("author_name", "company_name", "is_published", "order")
    list_editable = ("is_published", "order")
    search_fields = ("author_name", "company_name")
