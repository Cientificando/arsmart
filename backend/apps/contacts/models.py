from apps.core.models import TimeStampedModel
from django.db import models


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=150, verbose_name="Nome")
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, verbose_name="Telefone")
    subject = models.CharField(max_length=200, verbose_name="Assunto")
    message = models.TextField(verbose_name="Mensagem")
    is_read = models.BooleanField(default=False, verbose_name="Lida")
    privacy_consent = models.BooleanField(default=False, verbose_name="Consentimento de privacidade")

    class Meta:
        verbose_name = "Mensagem de Contacto"
        verbose_name_plural = "Mensagens de Contacto"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject}"
