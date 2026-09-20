# ARSMART Digital — Frontend

O portal institucional da **ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA.**, desenvolvido para oferecer uma experiência de excelência e alto desempenho. Esta interface consome os dados e catálogos da API (Django REST) para apresentar os serviços de forma responsiva e optimizada.

## Arquitetura Tecnológica

- **Framework:** Next.js 16 (App Router, Server Components)
- **Linguagem:** TypeScript (strict mode para máxima fiabilidade)
- **Estilização:** Tailwind CSS v4 (design system proprietário)
- **Integração:** Comunicação tipada com o backend Django

## Instalação e Desenvolvimento Local

```bash
cd frontend
npm install
cp .env.example .env.local
```

Assegure-se de que a variável `NEXT_PUBLIC_API_URL` aponta para a localização correcta do backend em execução (ex: `http://localhost:8000/api/v1`).

```bash
npm run dev
```

## Estrutura do Projecto

```
src/
  app/            # Roteamento baseado em ficheiros (App Router)
  components/
    ui/           # Componentes base e primitivos de interface
    layout/       # Elementos estruturais (Navbar, Footer)
    sections/     # Módulos complexos e formulários
  lib/api.ts      # Camada de comunicação centralizada com a API
  types/          # Definições estritas baseadas nos modelos do backend
```

## Funcionalidades e SEO

- **Componentização Avançada:** Arquitetura limpa com separação entre Client Components e Server Components, optimizando o desempenho e minimizando o peso do JavaScript no cliente.
- **Experiência do Utilizador (UX):** Interacção suave nos formulários com submissão assíncrona, notificações imediatas de sucesso (geração de referências únicas, ex: `REQ-2026-00001`) e validação de consentimento de privacidade.
- **Acessibilidade (A11y):** Foco semântico em todos os elementos interactivos, navegação por teclado optimizada e respeito pelas preferências de movimento (reduced-motion).
- **Optimização para Motores de Busca (SEO):** Geração dinâmica de ficheiros `sitemap.xml` e `robots.txt`, gestão nativa de metadados via App Router e rotas indexáveis em profundidade para todos os serviços, software e projectos.

## Build de Produção

A compilação para ambiente de produção (SSG/SSR) verifica de forma estrita o código TypeScript e produz os estáticos optimizados.

```bash
npm run build
npm run start
```

---
*ARSMART - Soluções corporativas inovadoras.*
