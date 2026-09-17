# ARSMART Digital — Backend

API REST (Django + Django REST Framework + PostgreSQL) que suporta a plataforma
web da ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA.

> Este backend foi construído como fundação real e funcional do projecto —
> ver `PLANO.md` na raiz do projecto para o que falta implementar no frontend
> e nas fases seguintes.

## Stack

- Python 3.12, Django 6, Django REST Framework
- PostgreSQL (SQLite suportado apenas em desenvolvimento local, via `USE_SQLITE=True`)
- Autenticação por Token (DRF TokenAuthentication) para o backoffice
- `django-cors-headers`, `django-filter`

## Arquitectura de pastas

```
backend/
  config/            # settings, urls, wsgi/asgi
  apps/
    core/            # modelos base (timestamps, soft delete, UUID, auditoria) + seed_data
    accounts/        # User com roles (SUPERADMIN, ADMIN, EDITOR, SALES) + login/token
    company/         # CompanyProfile, SocialLink, SiteSetting, FAQ
    catalog/         # ServiceCategory, Service, BusinessArea (áreas do objecto social)
    software/        # SoftwareSolution, SoftwareScreenshot (ex: NEGOMIL)
    procurement/      # ProductCategory (fornecimento sob solicitação)
    projects/        # ProjectCategory, Project
    quotes/          # QuoteRequest, QuoteRequestHistory, ProcurementDetail (Ordem de Saque)
    contacts/        # ContactMessage
```

### Decisão arquitectural: `QuoteRequest` unificado

O documento de requisitos refere tanto "pedidos de orçamento" como "pedidos de
fornecimento" como conceitos distintos. Optámos por um único modelo
`QuoteRequest` com campo `request_type` (`SERVICE`, `SOFTWARE`, `SUPPLY`,
`CONSULTING`, `OTHER`), em vez de duplicar entidades quase idênticas — reduz
complexidade sem perder nenhum requisito (todos os campos pedidos existem).

## Instalação (desenvolvimento local)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Em desenvolvimento sem Postgres instalado, defina no .env: USE_SQLITE=True
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

API disponível em `http://localhost:8000/api/v1/`
Admin disponível em `http://localhost:8000/admin/`

## Variáveis de ambiente

Ver `.env.example` — inclui `DATABASE_URL`/`DB_*`, `SECRET_KEY`,
`ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `EMAIL_*`, `WHATSAPP_NUMBER`,
`ANALYTICS_ID`. Nenhuma credencial real está commitada.

## Migrações e seed

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data   # dados mínimos reais: categorias, serviços, NEGOMIL, FAQs
```

O `seed_data` **não** cria clientes, projectos, testemunhos ou métricas
fictícias — apenas estrutura base editável no admin, conforme regra do
projecto.

## Testes

```bash
python manage.py test apps
```

14 testes cobrem: criação de pedido de orçamento e geração de referência
(`REQ-2026-00001`), validação de consentimento de privacidade, validação de
campos obrigatórios por tipo de pedido, autenticação do backoffice, controlo
de acesso a endpoints administrativos, mudança de estado com histórico, e o
catálogo público de serviços.

## Principais endpoints (`/api/v1/`)

| Método | Endpoint | Acesso |
|---|---|---|
| GET | `/company/` | público |
| GET | `/services/`, `/services/{slug}/` | público |
| GET | `/service-categories/` | público |
| GET | `/business-areas/` | público |
| GET | `/software/`, `/software/{slug}/` | público |
| GET | `/product-categories/` | público |
| GET | `/projects/`, `/projects/{slug}/` | público |
| GET | `/faqs/` | público |
| POST | `/quote-requests/` | público (cria pedido, devolve referência) |
| POST | `/contact/` | público |
| POST | `/auth/login/` | público (devolve token) |
| GET | `/auth/me/` | autenticado |
| CRUD | `/admin/quote-requests/` | staff/admin (token) |
| POST | `/admin/quote-requests/{id}/change-status/` | staff/admin |
| CRUD | `/admin/contact-messages/` | staff/admin |

O CRUD completo de serviços, software e projectos usa os mesmos endpoints
públicos com permissão `IsAuthenticatedOrReadOnly`: leitura é pública,
escrita exige autenticação de staff. Recomenda-se também gerir estes
conteúdos directamente via `/admin/` (Django Admin), que já oferece CRUD,
reordenação, destaque e filtros conforme pedido.

## Segurança implementada

- CORS restritivo por variável de ambiente
- Tokens de autenticação (nunca sessão exposta em APIs públicas de escrita)
- Throttling anónimo (60 pedidos/min) nos endpoints públicos
- Validação server-side em todos os formulários (consentimento obrigatório,
  campos condicionais por tipo de pedido)
- Sem segredos no código — tudo via `.env`
- Em produção (`DEBUG=False`): HSTS, cookies seguros, redirecionamento HTTPS,
  `X-Frame-Options: DENY`
- Ordem de Saque e notas internas nunca expostas nos endpoints/serializers públicos

## Docker

```bash
cp .env.example .env   # editar valores
docker compose up --build
```

Sobe `db` (PostgreSQL 16) e `backend` (migra, recolhe estáticos e arranca com Gunicorn).

## Utilizador administrador inicial

Nunca hardcoded. Criar com:

```bash
python manage.py createsuperuser
```

Superusers recebem automaticamente o papel `SUPERADMIN`.

## O que falta / próximos passos

- Frontend Next.js (próxima entrega)
- Envio de emails nos eventos (estrutura de `EMAIL_*` pronta; disparo de
  emails ainda não implementado)
- Sitemap.xml / robots.txt / Structured Data (âmbito do frontend Next.js)
- Rate limiting mais granular por endpoint, se necessário
