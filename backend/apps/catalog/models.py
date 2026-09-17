from django.db import models
from django.utils.text import slugify

from apps.core.models import OrderableModel, TimeStampedModel


class ServiceCategory(TimeStampedModel, OrderableModel):
    name = models.CharField(max_length=150, unique=True, verbose_name="Nome")
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Categoria de Serviço"
        verbose_name_plural = "Categorias de Serviços"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Service(TimeStampedModel, OrderableModel):
    category = models.ForeignKey(
        ServiceCategory, on_delete=models.PROTECT, related_name="services", verbose_name="Categoria"
    )
    name = models.CharField(max_length=200, verbose_name="Nome")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.CharField(max_length=300, verbose_name="Descrição curta")
    full_description = models.TextField(verbose_name="Descrição completa")
    benefits = models.TextField(blank=True, verbose_name="Benefícios", help_text="Um benefício por linha.")
    process = models.TextField(blank=True, verbose_name="Processo", help_text="Um passo por linha.")
    image = models.ImageField(upload_to="services/", blank=True, null=True)
    cta_label = models.CharField(max_length=80, default="Solicitar orçamento", verbose_name="Texto do CTA")

    class Meta:
        verbose_name = "Serviço"
        verbose_name_plural = "Serviços"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BusinessArea(TimeStampedModel, OrderableModel):
    """
    Agrupamento comercial do objecto social amplo da empresa (Secção 43).
    Representa a abrangência legal, não implica operação actual — ver `status`.
    """

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Activa"
        AVAILABLE_ON_REQUEST = "AVAILABLE_ON_REQUEST", "Sob solicitação"
        CONSULTATION = "CONSULTATION", "Sob consulta"
        DEVELOPMENT = "DEVELOPMENT", "Em desenvolvimento"
        INACTIVE = "INACTIVE", "Inactiva"

    name = models.CharField(max_length=150, unique=True, verbose_name="Nome")
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="business_areas/", blank=True, null=True, verbose_name="Imagem")
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.AVAILABLE_ON_REQUEST)

    class Meta:
        verbose_name = "Área de Actividade"
        verbose_name_plural = "Áreas de Actividade"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
