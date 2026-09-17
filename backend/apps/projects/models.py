from django.db import models
from django.utils.text import slugify

from apps.core.models import OrderableModel, TimeStampedModel


class ProjectCategory(TimeStampedModel, OrderableModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)

    class Meta:
        verbose_name = "Categoria de Projecto"
        verbose_name_plural = "Categorias de Projectos"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(TimeStampedModel, OrderableModel):
    class Status(models.TextChoices):
        PUBLISHED = "PUBLISHED", "Publicado"
        DRAFT = "DRAFT", "Rascunho"

    category = models.ForeignKey(
        ProjectCategory, on_delete=models.PROTECT, related_name="projects", null=True, blank=True
    )
    name = models.CharField(max_length=200, verbose_name="Nome")
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    client_name = models.CharField(max_length=150, blank=True, verbose_name="Cliente (opcional)")
    description = models.TextField(verbose_name="Descrição")
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    date = models.DateField(null=True, blank=True, verbose_name="Data")
    location = models.CharField(max_length=150, blank=True, verbose_name="Localização")
    services_involved = models.ManyToManyField(
        "catalog.Service", blank=True, related_name="projects", verbose_name="Serviços envolvidos"
    )
    results = models.TextField(blank=True, verbose_name="Resultados")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    class Meta:
        verbose_name = "Projecto"
        verbose_name_plural = "Projectos"
        ordering = ["order", "-date"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
