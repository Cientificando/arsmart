# ARSMART — Guia de Deployment (Vercel + Neon + Cloudinary)

Este guia leva o projecto do computador local até produção.

**Ordem importa:** base de dados → Cloudinary → backend → frontend.
O frontend consome a API do backend durante o build, por isso o backend
tem de estar no ar primeiro.

---

## Arquitectura

| Componente | Serviço | Notas |
|---|---|---|
| Frontend (Next.js) | Vercel | Projecto separado, pasta `frontend/` |
| Backend (Django) | Vercel | Projecto separado, pasta `backend/` |
| Base de dados | Neon (PostgreSQL) | Plano gratuito suficiente para começar |
| Imagens e anexos | Cloudinary | Plano gratuito suficiente para começar |

Serão **dois projectos distintos no Vercel**, apontando para o mesmo
repositório mas com *Root Directory* diferente.

---

## Passo 1 — Base de dados (Neon)

1. Criar conta em https://neon.tech
2. **Create Project** → nome `arsmart`, região mais próxima (Frankfurt ou Londres
   servem bem Angola)
3. Copiar a **Connection String** (a versão *Pooled connection*, importante para
   serverless). Tem este aspecto:

   ```
   postgresql://user:password@ep-xxxx-pooler.eu-central-1.aws.neon.tech/arsmart?sslmode=require
   ```

Guarde-a — é o valor de `DATABASE_URL`.

> Alternativa: Supabase ou Railway funcionam igualmente. O importante é ser
> PostgreSQL acessível pela internet, com ligação *pooled*.

---

## Passo 2 — Cloudinary (imagens e anexos)

No Vercel o sistema de ficheiros é efémero: tudo o que for carregado no Painel
Administrativo desaparece no pedido seguinte. O Cloudinary resolve isso.

1. Criar conta em https://cloudinary.com
2. **Dashboard** → secção *Product Environment Credentials*
3. Copiar os três valores:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

Se estas três variáveis não forem definidas, o Django volta automaticamente ao
armazenamento local — útil em desenvolvimento, inadequado em produção.

---

## Passo 3 — Backend no Vercel

1. Colocar o projecto no GitHub (se ainda não estiver):

   ```bash
   cd arsmart
   git init
   git add .
   git commit -m "ARSMART: plataforma institucional"
   git remote add origin https://github.com/SEU_UTILIZADOR/arsmart.git
   git push -u origin main
   ```

   Os ficheiros `.gitignore` já impedem que `.env`, `venv/` e `node_modules/`
   sejam enviados.

2. No Vercel: **Add New → Project** → importar o repositório
3. **Root Directory:** `backend`
4. **Framework Preset:** *Other*
5. Em **Environment Variables**, adicionar:

   | Variável | Valor |
   |---|---|
   | `SECRET_KEY` | gerar (ver abaixo) |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `.vercel.app` (acrescentar o domínio próprio depois) |
   | `DATABASE_URL` | a connection string do Neon |
   | `CLOUDINARY_CLOUD_NAME` | do Cloudinary |
   | `CLOUDINARY_API_KEY` | do Cloudinary |
   | `CLOUDINARY_API_SECRET` | do Cloudinary |
   | `CORS_ALLOWED_ORIGINS` | preencher depois do Passo 4 |
   | `CSRF_TRUSTED_ORIGINS` | preencher depois do Passo 4 |
   | `DJANGO_SUPERUSER_USERNAME` | o seu utilizador de admin |
   | `DJANGO_SUPERUSER_PASSWORD` | password forte, mínimo 10 caracteres |
   | `DJANGO_SUPERUSER_EMAIL` | o seu email |
   | `WHATSAPP_NUMBER` | `244923766892` |

   Para gerar a `SECRET_KEY`:

   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(50))"
   ```

6. **Deploy**

O `build_files.sh` corre automaticamente e trata de: instalar dependências,
recolher estáticos do Admin, aplicar migrações, semear o conteúdo inicial e
criar o administrador. Todos os passos são idempotentes — repetir o deploy não
duplica nada.

7. Anotar o URL gerado, por exemplo `https://arsmart-backend.vercel.app`

**Verificar:**
- `https://arsmart-backend.vercel.app/api/v1/company/` → devolve JSON
- `https://arsmart-backend.vercel.app/admin/` → página de login com estilos

---

## Passo 4 — Frontend no Vercel

1. **Add New → Project** → importar **o mesmo repositório**
2. **Root Directory:** `frontend`
3. **Framework Preset:** Next.js (detectado automaticamente)
4. Environment Variables:

   | Variável | Valor |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://arsmart-backend.vercel.app/api/v1` |
   | `NEXT_PUBLIC_SITE_URL` | o URL final do site |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `244923766892` |

5. **Deploy**

---

## Passo 5 — Fechar o círculo (CORS)

Voltar ao **projecto do backend** no Vercel → Settings → Environment Variables
e preencher agora que já se conhece o URL do frontend:

```
CORS_ALLOWED_ORIGINS = https://arsmart.vercel.app,https://arsmart.co.ao
CSRF_TRUSTED_ORIGINS = https://arsmart.vercel.app,https://arsmart.co.ao,https://arsmart-backend.vercel.app
ALLOWED_HOSTS = .vercel.app,api.arsmart.co.ao
```

**Redeploy o backend** para as variáveis entrarem em vigor.

Sem este passo os formulários falham silenciosamente com erro de CORS.

---

## Passo 6 — Primeiros passos no Painel Administrativo

Aceder a `https://arsmart-backend.vercel.app/admin/` e entrar com as credenciais
definidas nas variáveis de ambiente.

Carregar o que ainda falta:

- **Perfil da Empresa** → logótipo oficial e favicon
- **Soluções de Software → NEGOMIL** → funcionalidades reais, fabricante (quando
  confirmado), screenshots, requisitos
- **Serviços** → imagens e descrições detalhadas
- **Redes Sociais** → apenas as que existirem (as vazias não aparecem no site)

As alterações reflectem-se no site em até 60 segundos (revalidação incremental).

---

## Domínio próprio

Em cada projecto do Vercel: **Settings → Domains → Add**

Sugestão:
- Frontend: `arsmart.co.ao` e `www.arsmart.co.ao`
- Backend: `api.arsmart.co.ao`

Depois de configurar, actualizar `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
`CSRF_TRUSTED_ORIGINS` e `NEXT_PUBLIC_API_URL` com os domínios definitivos, e
fazer redeploy de ambos.

---

## Resolução de problemas

| Sintoma | Causa provável |
|---|---|
| Admin sem estilos (HTML em bruto) | `collectstatic` falhou — ver logs do build |
| Erro CORS nos formulários | `CORS_ALLOWED_ORIGINS` sem o domínio do frontend |
| `DisallowedHost` | Falta o domínio em `ALLOWED_HOSTS` |
| Imagens desaparecem após upload | Credenciais Cloudinary em falta ou erradas |
| Loop de redirects | Já resolvido via `SECURE_PROXY_SSL_HEADER`; verificar se `DEBUG=False` |
| Site sem conteúdo, tudo em empty state | Backend inacessível durante o build do frontend — redeploy do frontend |
| `CSRF verification failed` no Admin | Falta o domínio do backend em `CSRF_TRUSTED_ORIGINS` |

---

## Limitações conhecidas desta configuração

Vale a pena conhecê-las antes de escalar:

- **Cold starts:** a primeira visita após período de inactividade pode demorar
  2–4 segundos enquanto a função Django arranca. Aceitável para um site
  institucional; se se tornar incómodo, mover o backend para Railway ou Render
  (servidor sempre activo) é uma mudança de configuração, não de código.
- **Sem tarefas em segundo plano:** envio de emails, quando implementado, será
  síncrono. Para volumes altos seria necessário Celery + worker dedicado.
- **Limite de tempo por pedido** no plano gratuito do Vercel (10 s) — suficiente
  para esta aplicação.
