from django.db import models
from django.utils.text import slugify

from apps.core.models import OrderableModel, TimeStampedModel


class ProductCategory(TimeStampedModel, OrderableModel):
    """Categoria configurável para pedidos de fornecimento sob solicitação."""

    name = models.CharField(max_length=150, unique=True, verbose_name="Nome")
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Categoria de Fornecimento"
        verbose_name_plural = "Categorias de Fornecimento"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
