"""
Entrypoint serverless para o Vercel.

O Vercel procura um objecto WSGI/ASGI chamado `app` neste ficheiro.
Reutiliza a aplicação WSGI padrão do Django definida em config/wsgi.py.
"""

import os
import sys
from pathlib import Path

# Garante que a raiz do projecto está no sys.path (o Vercel executa a partir de /api).
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from config.wsgi import application  # noqa: E402

app = application
