from django.db import models

from apps.core.models import TimeStampedModel


class CompanyProfile(models.Model):
    """
    Perfil institucional da empresa. Modelo singleton (deve existir apenas
    um registo) editável através do painel administrativo.
    """

    legal_name = models.CharField(
        max_length=255,
        default="ARSMART - COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS (SU), LDA",
        verbose_name="Firma (nome legal)",
    )
    trade_name = models.CharField(max_length=100, default="ARSMART", verbose_name="Nome comercial")
    nif = models.CharField(max_length=30, default="5002476959", verbose_name="NIF")
    registration_number = models.CharField(max_length=60, default="13222-25/250420", verbose_name="Matrícula")
    legal_form = models.CharField(
        max_length=120, default="Sociedade Unipessoal por Quotas", verbose_name="Forma jurídica"
    )
    founded_year = models.PositiveIntegerField(default=2025, verbose_name="Ano de constituição")
    capital = models.DecimalField(max_digits=14, decimal_places=2, default=100000.00, verbose_name="Capital social (Kz)")

    address = models.TextField(
        default=(
            "Bairro Centro Urbano, Rua Principal do Centro Urbano, casa s/n.º, "
            "nas imediações da ENDE-Dundo e Largo Samanhoga"
        ),
        verbose_name="Morada",
    )
    province = models.CharField(max_length=120, default="Lunda Norte", verbose_name="Província")
    municipality = models.CharField(max_length=120, default="Dundo", verbose_name="Município")
    country = models.CharField(max_length=120, default="Angola", verbose_name="País")

    phone = models.CharField(max_length=30, blank=True, verbose_name="Telefone")
    email = models.EmailField(blank=True, verbose_name="Email")
    whatsapp = models.CharField(
        max_length=30, blank=True, help_text="Formato internacional, ex: 244900000000", verbose_name="WhatsApp"
    )
    website = models.URLField(blank=True, verbose_name="Website")

    description = models.TextField(
        blank=True,
        default=(
            "A ARSMART ajuda empresas, instituições e clientes a resolver necessidades através de "
            "serviços, soluções tecnológicas, software, consultoria e fornecimento sob solicitação."
        ),
        verbose_name="Descrição institucional",
    )
    mission = models.TextField(blank=True, verbose_name="Missão")
    vision = models.TextField(blank=True, verbose_name="Visão")
    values = models.TextField(blank=True, verbose_name="Valores", help_text="Um valor por linha.")

    logo = models.ImageField(upload_to="company/", blank=True, null=True, verbose_name="Logótipo")
    favicon = models.ImageField(upload_to="company/", blank=True, null=True, verbose_name="Favicon")

    google_maps_url = models.URLField(blank=True, verbose_name="Localização (Google Maps)")

    class Meta:
        verbose_name = "Perfil da Empresa"
        verbose_name_plural = "Perfil da Empresa"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    def __str__(self):
        return self.trade_name


class SocialLink(TimeStampedModel):
    class Platform(models.TextChoices):
        FACEBOOK = "FACEBOOK", "Facebook"
        INSTAGRAM = "INSTAGRAM", "Instagram"
        LINKEDIN = "LINKEDIN", "LinkedIn"
        TIKTOK = "TIKTOK", "TikTok"
        YOUTUBE = "YOUTUBE", "YouTube"
        X = "X", "X (Twitter)"

    platform = models.CharField(max_length=20, choices=Platform.choices)
    url = models.URLField()
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Rede Social"
        verbose_name_plural = "Redes Sociais"

    def __str__(self):
        return f"{self.get_platform_display()}"


class SiteSetting(TimeStampedModel):
    """Par chave/valor genérico para configurações do site (ex: analytics id)."""

    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Definição do Site"
        verbose_name_plural = "Definições do Site"
        ordering = ["key"]

    def __str__(self):
        return self.key


class CompanyValue(TimeStampedModel):
    """Valor institucional (ex: Confiança, Compromisso) com nome e descrição curta."""

    name = models.CharField(max_length=100, verbose_name="Nome")
    description = models.TextField(verbose_name="Descrição")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Valor da Empresa"
        verbose_name_plural = "Valores da Empresa"
        ordering = ["order"]

    def __str__(self):
        return self.name


class TeamMember(TimeStampedModel):
    name = models.CharField(max_length=150, verbose_name="Nome")
    role = models.CharField(max_length=150, verbose_name="Cargo")
    bio = models.TextField(blank=True, verbose_name="Biografia")
    photo = models.ImageField(upload_to="team/", blank=True, null=True, verbose_name="Fotografia")
    linkedin_url = models.URLField(blank=True, verbose_name="LinkedIn")
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False, verbose_name="Publicado")

    class Meta:
        verbose_name = "Membro da Equipa"
        verbose_name_plural = "Equipa"
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} — {self.role}"


class Testimonial(TimeStampedModel):
    author_name = models.CharField(max_length=150, verbose_name="Nome")
    author_role = models.CharField(max_length=150, blank=True, verbose_name="Cargo")
    company_name = models.CharField(max_length=150, blank=True, verbose_name="Empresa")
    content = models.TextField(verbose_name="Testemunho")
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False, verbose_name="Publicado")

    class Meta:
        verbose_name = "Testemunho"
        verbose_name_plural = "Testemunhos"
        ordering = ["order"]

    def __str__(self):
        return self.author_name


class FAQ(TimeStampedModel):
    question = models.CharField(max_length=255, verbose_name="Pergunta")
    answer = models.TextField(verbose_name="Resposta")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Pergunta Frequente"
        verbose_name_plural = "Perguntas Frequentes"
        ordering = ["order"]

    def __str__(self):
        return self.question
