# ARSMART Digital — Backend

API REST (Django + Django REST Framework + PostgreSQL) que suporta a plataforma Web corporativa da **ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA.**

## Arquitetura Tecnológica

- **Linguagem & Framework:** Python 3.12, Django 6, Django REST Framework
- **Base de Dados:** PostgreSQL (SQLite suportado apenas em desenvolvimento local)
- **Autenticação:** Baseada em Token (DRF TokenAuthentication) para o Backoffice
- **Segurança & Performance:** `django-cors-headers`, `django-filter`, Throttling

## Estrutura do Projecto

A aplicação está estruturada de forma modular, com separação clara de responsabilidades:

- **`core/`**: Modelos base (timestamps, soft delete, UUID, auditoria).
- **`accounts/`**: Gestão de utilizadores com perfis de acesso (SUPERADMIN, ADMIN, EDITOR, SALES).
- **`company/`**: Perfil da empresa, ligações sociais, definições do site e FAQs.
- **`catalog/`**: Áreas de negócio, categorias e catálogo de serviços.
- **`software/`**: Catálogo de soluções tecnológicas e software (ex: NEGOMIL).
- **`procurement/`**: Gestão de fornecimento sob solicitação e categorias de produtos.
- **`projects/`**: Portfólio de projectos executados.
- **`quotes/`**: Sistema centralizado de pedidos comerciais (Orçamentos, Demonstrações, Consultoria).
- **`contacts/`**: Gestão de mensagens de contacto público.

## Instalação e Desenvolvimento Local

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Para desenvolvimento sem PostgreSQL instalado, defina no ficheiro `.env`:
`USE_SQLITE=True`

**Inicialização da Base de Dados:**
```bash
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

- API disponível em: `http://localhost:8000/api/v1/`
- Backoffice (Admin) em: `http://localhost:8000/admin/`

## Configuração (Variáveis de Ambiente)

O sistema baseia-se num ficheiro `.env` para a configuração de ambiente. O ficheiro `.env.example` serve como modelo e inclui as variáveis necessárias para a ligação à base de dados (`DATABASE_URL`), definições de segurança (`SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`), integração de comunicações (`EMAIL_*`, `WHATSAPP_NUMBER`) e métricas (`ANALYTICS_ID`).

> Acesso seguro e sem hardcoding de credenciais.

## API & Endpoints Principais

A API pública opera em modo de leitura (Read-Only) para os catálogos e permite escrita (criação) apenas para os formulários de contacto e orçamentos, protegidos por limitação de tráfego (Throttling). A gestão integral dos dados requer autenticação.

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| GET | `/company/`, `/faqs/` | Público | Dados institucionais |
| GET | `/services/`, `/software/`, `/projects/` | Público | Catálogos (lista e detalhe) |
| POST | `/quote-requests/` | Público | Submissão de pedidos com devolução de Referência |
| POST | `/contact/` | Público | Envio de mensagens de contacto |
| POST | `/auth/login/` | Público | Autenticação (devolve token) |
| CRUD | `/admin/quote-requests/` | Autenticado | Gestão completa de pedidos comerciais |

## Segurança

O backend aplica rigorosas normas de segurança:
- **CORS Restritivo:** Configuração estrita de origens permitidas via variável de ambiente.
- **Protecção de Formulários:** Validação robusta (Server-Side) de todos os dados recebidos.
- **Throttling:** Protecção contra abusos na submissão de formulários públicos.
- **Produção (Security Headers):** HSTS, Secure Cookies, redireccionamento HTTPS obrigatório e protecção contra Clickjacking.

## Docker

A infraestrutura inclui suporte completo a contentorização via Docker.

```bash
cp .env.example .env
docker compose up --build
```
Este comando orquestra os serviços necessários, incluindo a instância de base de dados e o servidor aplicacional com Gunicorn.

---
*ARSMART - Soluções corporativas inovadoras.*
