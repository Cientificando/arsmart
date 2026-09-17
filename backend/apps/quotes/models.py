from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.core.models import TimeStampedModel
from apps.core.validators import validate_upload_file


def _current_year() -> int:
    return timezone.now().year


class QuoteRequest(TimeStampedModel):
    """
    Pedido comercial unificado: serviço, software, fornecimento, consultoria
    ou outro. Um único modelo evita duplicação entre "pedido de orçamento" e
    "pedido de fornecimento" — o campo `request_type` distingue o fluxo.
    """

    class RequestType(models.TextChoices):
        SERVICE = "SERVICE", "Serviço"
        SOFTWARE = "SOFTWARE", "Software"
        SUPPLY = "SUPPLY", "Fornecimento"
        CONSULTING = "CONSULTING", "Consultoria"
        DEMO = "DEMO", "Demonstração"
        PROPOSAL = "PROPOSAL", "Proposta"
        OTHER = "OTHER", "Outro"

    class Status(models.TextChoices):
        NEW = "NEW", "Novo"
        UNDER_REVIEW = "UNDER_REVIEW", "Em análise"
        CONTACTED = "CONTACTED", "Cliente contactado"
        QUOTATION_PREPARED = "QUOTATION_PREPARED", "Proposta preparada"
        AWAITING_APPROVAL = "AWAITING_APPROVAL", "Aguarda aprovação"
        APPROVED = "APPROVED", "Aprovado"
        PROCUREMENT = "PROCUREMENT", "Em aquisição"
        FULFILLED = "FULFILLED", "Fornecido"
        COMPLETED = "COMPLETED", "Concluído"
        CANCELLED = "CANCELLED", "Cancelado"

    reference = models.CharField(max_length=30, unique=True, editable=False)

    customer_name = models.CharField(max_length=150, verbose_name="Nome")
    company_name = models.CharField(max_length=150, blank=True, verbose_name="Empresa")
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, verbose_name="Telefone")
    whatsapp = models.CharField(max_length=30, blank=True, verbose_name="WhatsApp")

    request_type = models.CharField(max_length=20, choices=RequestType.choices)
    service = models.ForeignKey(
        "catalog.Service", null=True, blank=True, on_delete=models.SET_NULL, related_name="quote_requests"
    )
    software = models.ForeignKey(
        "software.SoftwareSolution", null=True, blank=True, on_delete=models.SET_NULL, related_name="quote_requests"
    )
    product_category = models.ForeignKey(
        "procurement.ProductCategory", null=True, blank=True, on_delete=models.SET_NULL, related_name="quote_requests"
    )

    subject = models.CharField(max_length=200, verbose_name="Assunto")
    description = models.TextField(verbose_name="Descrição da necessidade")
    quantity = models.CharField(max_length=50, blank=True, verbose_name="Quantidade")
    budget = models.CharField(max_length=100, blank=True, verbose_name="Orçamento estimado")
    location = models.CharField(max_length=150, blank=True, verbose_name="Localização")
    deadline = models.CharField(max_length=100, blank=True, verbose_name="Prazo")
    attachment = models.FileField(
        upload_to="quote_attachments/%Y/%m/", blank=True, null=True, validators=[validate_upload_file]
    )

    status = models.CharField(max_length=25, choices=Status.choices, default=Status.NEW)
    priority = models.CharField(
        max_length=10,
        choices=[("LOW", "Baixa"), ("NORMAL", "Normal"), ("HIGH", "Alta")],
        default="NORMAL",
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_requests"
    )
    internal_notes = models.TextField(blank=True, verbose_name="Notas internas")

    privacy_consent = models.BooleanField(default=False, verbose_name="Consentimento de privacidade")

    class Meta:
        verbose_name = "Pedido de Orçamento"
        verbose_name_plural = "Pedidos de Orçamento"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self._generate_reference()
        super().save(*args, **kwargs)

    def _generate_reference(self) -> str:
        year = _current_year()
        prefix = f"REQ-{year}-"
        last = (
            QuoteRequest.objects.filter(reference__startswith=prefix).order_by("-reference").first()
        )
        next_number = 1
        if last:
            try:
                next_number = int(last.reference.rsplit("-", 1)[-1]) + 1
            except ValueError:
                next_number = QuoteRequest.objects.filter(reference__startswith=prefix).count() + 1
        return f"{prefix}{next_number:05d}"

    def change_status(self, new_status: str, changed_by=None, comment: str = ""):
        old_status = self.status
        if old_status == new_status:
            return
        self.status = new_status
        self.save(update_fields=["status", "updated_at"])
        QuoteRequestHistory.objects.create(
            request=self,
            old_status=old_status,
            new_status=new_status,
            comment=comment,
            changed_by=changed_by,
        )

    def __str__(self):
        return f"{self.reference} — {self.customer_name}"


class QuoteRequestHistory(models.Model):
    request = models.ForeignKey(QuoteRequest, on_delete=models.CASCADE, related_name="history")
    old_status = models.CharField(max_length=25, blank=True)
    new_status = models.CharField(max_length=25)
    comment = models.TextField(blank=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Histórico de Pedido"
        verbose_name_plural = "Histórico de Pedidos"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.request.reference}: {self.old_status} → {self.new_status}"


class ProcurementDetail(models.Model):
    """
    Dados internos de aquisição/Ordem de Saque — nunca expostos publicamente.
    Relação 1-para-1 com o pedido, criada apenas quando aplicável.
    """

    class Status(models.TextChoices):
        NOT_REQUIRED = "NOT_REQUIRED", "Não aplicável"
        PENDING = "PENDING", "Pendente"
        ISSUED = "ISSUED", "Emitida"
        USED = "USED", "Utilizada"
        CANCELLED = "CANCELLED", "Cancelada"

    request = models.OneToOneField(QuoteRequest, on_delete=models.CASCADE, related_name="procurement_detail")
    withdrawal_order_number = models.CharField(max_length=60, blank=True, verbose_name="N.º Ordem de Saque")
    withdrawal_order_date = models.DateField(null=True, blank=True, verbose_name="Data da Ordem de Saque")
    withdrawal_amount = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True, verbose_name="Montante (Kz)"
    )
    supplier = models.CharField(max_length=200, blank=True, verbose_name="Fornecedor")
    procurement_notes = models.TextField(blank=True, verbose_name="Notas de aquisição")
    procurement_status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_REQUIRED)

    class Meta:
        verbose_name = "Detalhe de Aquisição (Ordem de Saque)"
        verbose_name_plural = "Detalhes de Aquisição (Ordens de Saque)"

    def __str__(self):
        return f"Aquisição — {self.request.reference}"
