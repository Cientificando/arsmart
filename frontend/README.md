# ARSMART Digital — Frontend

Site público da ARSMART em Next.js (App Router) + TypeScript + Tailwind CSS v4,
ligado à API Django REST (`arsmart-backend`).

## Stack

- Next.js 16 (App Router, Server Components)
- TypeScript (strict)
- Tailwind CSS v4 (tokens de design em `src/app/globals.css`)
- `lucide-react` para ícones, `clsx` para classes condicionais

## Instalação

```bash
cd frontend
npm install
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL para apontar para o backend Django
npm run dev
```

Por omissão, `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` — arranque o
backend primeiro (ver `backend/README.md`), incluindo `python manage.py seed_data`.

## Fontes

O projecto usa Space Grotesk (títulos) e Inter (corpo de texto) como
`next/font/local`, com os ficheiros em `src/fonts/`. Em ambientes com acesso à
Google Fonts, estas podem ser substituídas por `next/font/google` sem
qualquer alteração ao design (os nomes das variáveis CSS mantêm-se).

## Estrutura

```
src/
  app/            # rotas (App Router) — uma pasta por página pública
  components/
    ui/           # Button, Card, Badge, FormField, EmptyState, etc.
    layout/       # Navbar, Footer, WhatsAppButton
    sections/     # blocos compostos (formulários, hero gráfico)
  lib/api.ts      # cliente central para a API Django (fetch tipado)
  types/          # tipos TypeScript alinhados com os serializers da API
```

## Páginas implementadas

Home, Empresa, Serviços (lista + detalhe), Soluções/Software (lista +
detalhe, incluindo NEGOMIL), Fornecimento, Projectos (lista + detalhe),
Contactos (com FAQ e formulário), Orçamento (formulário unificado com tipo
de pedido contextual — serviço/software/fornecimento/consultoria/outro),
Política de Privacidade, Termos, 404, página de erro genérica.

`/solicitar-servico`, `/solicitar-fornecimento` e `/solicitar-demonstracao`
redireccionam para `/orcamento` com o tipo pré-seleccionado — evita duplicar
o formulário mantendo os URLs pedidos no briefing.

## Formulários

`QuoteRequestForm` e `ContactForm` são Client Components que chamam
directamente a API pública (`POST /quote-requests/`, `POST /contact/`),
com estados `idle/submitting/success/error`, validação de consentimento de
privacidade, e apresentação da referência (`REQ-2026-00001`) devolvida pelo
backend após sucesso.

## SEO técnico

- `metadata` (title/description) por página via App Router
- `sitemap.ts` e `robots.ts` gerados dinamicamente
- Definir `NEXT_PUBLIC_SITE_URL` em produção para URLs absolutos correctos

## Build de produção

```bash
npm run build
npm run start
```

Build verificado localmente: 18 rotas geradas sem erros de TypeScript,
conteúdo confirmado a fluir correctamente do backend (serviços, NEGOMIL,
perfil da empresa, FAQs) até ao HTML renderizado.

## Acessibilidade e responsividade

- Focus visível (`:focus-visible`) em todos os elementos interactivos
- `prefers-reduced-motion` respeitado
- Navbar com menu mobile acessível (`aria-expanded`, `aria-label`)
- Testado nos breakpoints principais do Tailwind (sm/md/lg); grelha
  responsiva em todas as secções e formulários

## O que falta / próximos passos

- Upload de anexos no formulário de orçamento (o backend já aceita
  `attachment`, o campo de UI ainda não foi ligado — Secção 15/24)
- Páginas administrativas dedicadas no frontend: o backoffice actual é o
  Django Admin (ver `backend/README.md`); um painel Next.js dedicado ficaria
  para uma fase seguinte, se necessário
- Analytics: variável `NEXT_PUBLIC_ANALYTICS_ID` preparada, integração por
  implementar
- Imagens reais de serviços/software/projectos (actualmente sem imagem até
  serem carregadas via Django Admin)
