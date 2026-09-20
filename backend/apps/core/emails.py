"""
Módulo centralizado de e-mails transacionais da ARSMART.
Todas as funções são não-bloqueantes: falham em silêncio para não
interromper a resposta ao cliente caso o servidor de e-mail esteja
indisponível.
"""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

ADMIN_EMAIL = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@arsmart.co.ao")
COMPANY_NAME = "ARSMART"


def _send(subject: str, message: str, recipient_list: list[str], from_email: str = ADMIN_EMAIL) -> None:
    """Wrapper seguro que regista erros sem os propagar."""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Falha ao enviar e-mail para %s: %s", recipient_list, exc)


# ---------------------------------------------------------------------------
# Pedidos de Orçamento / Quote Requests
# ---------------------------------------------------------------------------

def notify_new_quote_request(instance) -> None:
    """Notifica a equipa interna de um novo pedido de orçamento."""
    subject = f"[{COMPANY_NAME}] Novo pedido de orçamento — {instance.reference}"
    message = (
        f"Foi recebido um novo pedido de orçamento.\n\n"
        f"Referência : {instance.reference}\n"
        f"Nome       : {instance.customer_name}\n"
        f"Empresa    : {instance.company_name or '—'}\n"
        f"Email      : {instance.email}\n"
        f"Telefone   : {instance.phone or '—'}\n"
        f"WhatsApp   : {instance.whatsapp or '—'}\n"
        f"Tipo       : {instance.get_request_type_display()}\n"
        f"Assunto    : {instance.subject}\n\n"
        f"Descrição:\n{instance.description}\n\n"
        f"Consulte o pedido completo no painel administrativo."
    )
    _send(subject, message, [ADMIN_EMAIL])


def confirm_quote_request_to_client(instance) -> None:
    """Envia confirmação de recepção ao cliente que submeteu o pedido."""
    subject = f"[{COMPANY_NAME}] Pedido recebido — Referência {instance.reference}"
    message = (
        f"Caro/a {instance.customer_name},\n\n"
        f"O seu pedido foi recebido com sucesso. A nossa equipa irá analisá-lo "
        f"e entrar em contacto brevemente.\n\n"
        f"Referência do seu pedido: {instance.reference}\n"
        f"Assunto: {instance.subject}\n\n"
        f"Se tiver alguma dúvida, responda a este e-mail ou contacte-nos pelo WhatsApp.\n\n"
        f"Com os melhores cumprimentos,\n"
        f"Equipa {COMPANY_NAME}\n"
        f"arsmart.co.ao"
    )
    _send(subject, message, [instance.email])


# ---------------------------------------------------------------------------
# Mensagens de Contacto / Contact Messages
# ---------------------------------------------------------------------------

def notify_new_contact_message(instance) -> None:
    """Notifica a equipa interna de uma nova mensagem de contacto."""
    subject = f"[{COMPANY_NAME}] Nova mensagem de contacto — {instance.name}"
    message = (
        f"Foi recebida uma nova mensagem através do formulário de contacto.\n\n"
        f"Nome    : {instance.name}\n"
        f"Email   : {instance.email}\n"
        f"Telefone: {instance.phone or '—'}\n"
        f"Assunto : {instance.subject}\n\n"
        f"Mensagem:\n{instance.message}"
    )
    _send(subject, message, [ADMIN_EMAIL])


def confirm_contact_message_to_sender(instance) -> None:
    """Envia confirmação de recepção ao remetente da mensagem de contacto."""
    subject = f"[{COMPANY_NAME}] Mensagem recebida — obrigado pelo seu contacto"
    message = (
        f"Caro/a {instance.name},\n\n"
        f"Recebemos a sua mensagem e responderemos o mais brevemente possível.\n\n"
        f"Assunto: {instance.subject}\n\n"
        f"Com os melhores cumprimentos,\n"
        f"Equipa {COMPANY_NAME}\n"
        f"arsmart.co.ao"
    )
    _send(subject, message, [instance.email])
