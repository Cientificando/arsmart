import uuid

from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """Base abstract model com created_at / updated_at."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteQuerySet(models.QuerySet):
    def alive(self):
        return self.filter(deleted_at__isnull=True)

    def dead(self):
        return self.filter(deleted_at__isnull=False)


class SoftDeleteManager(models.Manager):
    """Por omissão, apenas devolve registos não eliminados."""

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).alive()


class SoftDeleteModel(models.Model):
    """Base abstract model com eliminação suave (soft delete)."""

    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at"])

    def restore(self):
        self.deleted_at = None
        self.save(update_fields=["deleted_at"])

    @property
    def is_deleted(self):
        return self.deleted_at is not None


class UUIDModel(models.Model):
    """Base abstract model com chave primária UUID (para IDs internos)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class OrderableModel(models.Model):
    """Base abstract model para conteúdo reordenável e destacável no admin."""

    order = models.PositiveIntegerField(default=0, help_text="Ordem de exibição (menor primeiro).")
    is_featured = models.BooleanField(default=False, verbose_name="Destaque")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        abstract = True
        ordering = ["order"]


class AuditLog(models.Model):
    """Registo simples de acções administrativas sensíveis."""

    actor = models.ForeignKey(
        "accounts.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="audit_logs"
    )
    action = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registo de Auditoria"
        verbose_name_plural = "Registos de Auditoria"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.created_at:%Y-%m-%d %H:%M} — {self.action}"
