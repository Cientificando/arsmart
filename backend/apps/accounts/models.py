from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Utilizador do backoffice ARSMART com papel (role) de acesso."""

    class Role(models.TextChoices):
        SUPERADMIN = "SUPERADMIN", "Super Administrador"
        ADMIN = "ADMIN", "Administrador"
        EDITOR = "EDITOR", "Editor de Conteúdos"
        SALES = "SALES", "Comercial"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.EDITOR)
    phone = models.CharField(max_length=30, blank=True)

    def save(self, *args, **kwargs):
        if self.is_superuser and self.role != self.Role.SUPERADMIN:
            self.role = self.Role.SUPERADMIN
        super().save(*args, **kwargs)

    def is_admin_area_allowed(self) -> bool:
        return self.is_staff or self.role in {self.Role.SUPERADMIN, self.Role.ADMIN, self.Role.EDITOR, self.Role.SALES}

    def __str__(self):
        return self.get_full_name() or self.username
