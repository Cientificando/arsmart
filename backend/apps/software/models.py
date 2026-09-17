from django.db import models
from django.utils.text import slugify

from apps.core.models import OrderableModel, TimeStampedModel


class SoftwareSolution(TimeStampedModel, OrderableModel):
    class License(models.TextChoices):
        SUBSCRIPTION = "SUBSCRIPTION", "Subscrição"
        PERPETUAL = "PERPETUAL", "Licença perpétua"
        QUOTE_ONLY = "QUOTE_ONLY", "Sob consulta"

    name = models.CharField(max_length=150, verbose_name="Nome")
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    developer = models.CharField(max_length=150, blank=True, verbose_name="Fabricante/Desenvolvedor")
    category = models.CharField(max_length=150, blank=True, verbose_name="Categoria")
    short_description = models.CharField(max_length=300, verbose_name="Descrição curta")
    full_description = models.TextField(verbose_name="Descrição completa")
    features = models.TextField(blank=True, verbose_name="Funcionalidades", help_text="Uma por linha.")
    benefits = models.TextField(blank=True, verbose_name="Benefícios", help_text="Um por linha.")
    target_audience = models.TextField(blank=True, verbose_name="Público-alvo")
    requirements = models.TextField(blank=True, verbose_name="Requisitos")
    license_type = models.CharField(max_length=20, choices=License.choices, default=License.QUOTE_ONLY)
    price_note = models.CharField(max_length=150, blank=True, verbose_name="Nota de preço (opcional)")
    documentation_url = models.URLField(blank=True, verbose_name="Documentação")
    video_url = models.URLField(blank=True, verbose_name="Vídeo (URL)")
    cover_image = models.ImageField(upload_to="software/", blank=True, null=True)

    class Meta:
        verbose_name = "Solução de Software"
        verbose_name_plural = "Soluções de Software"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SoftwareScreenshot(TimeStampedModel):
    software = models.ForeignKey(SoftwareSolution, on_delete=models.CASCADE, related_name="screenshots")
    image = models.ImageField(upload_to="software/screenshots/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Screenshot de Software"
        verbose_name_plural = "Screenshots de Software"

    def __str__(self):
        return f"{self.software.name} — {self.caption or self.order}"
