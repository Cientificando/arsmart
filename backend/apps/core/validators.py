import os

from django.core.exceptions import ValidationError

ALLOWED_UPLOAD_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".docx"]
MAX_UPLOAD_SIZE_MB = 10


def validate_upload_file(file):
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError(
            f"Tipo de ficheiro não permitido ({ext}). Formatos aceites: "
            + ", ".join(ALLOWED_UPLOAD_EXTENSIONS)
        )
    if file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise ValidationError(f"O ficheiro excede o limite de {MAX_UPLOAD_SIZE_MB}MB.")
