#!/bin/bash
# Build executado pelo Vercel antes do deploy do backend Django.
set -e

echo "==> Instalar dependências"
pip install -r requirements.txt

echo "==> Recolher ficheiros estáticos (Django Admin)"
python manage.py collectstatic --noinput --clear

echo "==> Aplicar migrações"
python manage.py migrate --noinput

echo "==> Garantir conteúdo inicial (idempotente)"
python manage.py seed_data

echo "==> Garantir administrador inicial (idempotente)"
python manage.py bootstrap_admin

echo "==> Build concluído"
