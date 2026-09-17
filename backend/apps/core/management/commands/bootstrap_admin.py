import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Cria o superutilizador inicial a partir de variáveis de ambiente. "
        "Útil em ambientes sem terminal interactivo (ex: Vercel). "
        "Não faz nada se o utilizador já existir."
    )

    def handle(self, *args, **options):
        username = os.getenv("DJANGO_SUPERUSER_USERNAME")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_USERNAME e DJANGO_SUPERUSER_PASSWORD não definidos — "
                    "nenhum administrador criado."
                )
            )
            return

        if len(password) < 10:
            raise CommandError("A password do administrador deve ter pelo menos 10 caracteres.")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f"Administrador '{username}' já existe — nada a fazer."))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Administrador '{username}' criado com sucesso."))
