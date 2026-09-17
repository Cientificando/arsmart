from django.contrib import admin

from .models import ProcurementDetail, QuoteRequest, QuoteRequestHistory


class QuoteRequestHistoryInline(admin.TabularInline):
    model = QuoteRequestHistory
    extra = 0
    readonly_fields = ("old_status", "new_status", "comment", "changed_by", "created_at")
    can_delete = False


class ProcurementDetailInline(admin.StackedInline):
    model = ProcurementDetail
    extra = 0
    can_delete = False


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ("reference", "customer_name", "request_type", "status", "priority", "created_at")
    list_filter = ("status", "request_type", "priority")
    search_fields = ("reference", "customer_name", "company_name", "email")
    readonly_fields = ("reference", "created_at", "updated_at")
    inlines = [ProcurementDetailInline, QuoteRequestHistoryInline]
    fieldsets = (
        ("Referência", {"fields": ("reference", "status", "priority", "assigned_to")}),
        ("Cliente", {"fields": ("customer_name", "company_name", "email", "phone", "whatsapp")}),
        ("Pedido", {
            "fields": (
                "request_type", "service", "software", "product_category",
                "subject", "description", "quantity", "budget", "location",
                "deadline", "attachment",
            )
        }),
        ("Interno", {"fields": ("internal_notes",)}),
    )

    def save_model(self, request, obj, form, change):
        if change and "status" in form.changed_data:
            old = QuoteRequest.objects.get(pk=obj.pk).status
            super().save_model(request, obj, form, change)
            if old != obj.status:
                QuoteRequestHistory.objects.create(
                    request=obj, old_status=old, new_status=obj.status, changed_by=request.user
                )
        else:
            super().save_model(request, obj, form, change)
