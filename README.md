# ARSMART Digital — Plataforma Institucional

Repositório central do portal corporativo da **ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA.** 

Esta plataforma é constituída por dois sistemas independentes que comunicam via API, garantindo alta performance, segurança e escalabilidade.

## Estrutura do Repositório (Monorepo)

O projecto está dividido em duas pastas principais, cada uma com o seu próprio ecossistema e documentação detalhada:

### 1. [`/frontend`](./frontend/README.md)
A interface de utilizador (UI) voltada para o cliente público.
- **Tecnologias:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- **Responsabilidade:** Apresentação corporativa, catálogos (serviços, software, projectos), formulários de contacto e pedidos de orçamento com validação server-side. SEO optimizado e acessibilidade garantida.

### 2. [`/backend`](./backend/README.md)
O motor lógico, painel administrativo e base de dados.
- **Tecnologias:** Python 3.12, Django 6, Django REST Framework, PostgreSQL.
- **Responsabilidade:** Gestão integral de conteúdos via Backoffice, processamento de formulários públicos, envio de e-mails transacionais e disponibilização da API REST segura.

---

## Arranque Rápido (Desenvolvimento Local)

Para correr todo o projecto na sua máquina local, necessitará de inicializar ambos os serviços. Siga as instruções específicas nas respetivas pastas:

1. **Ligar o Backend (API):**
   Siga as instruções em `backend/README.md` para instalar dependências, configurar a base de dados, gerar dados iniciais e iniciar o servidor (geralmente em `http://localhost:8000`).

2. **Ligar o Frontend (Web):**
   Siga as instruções em `frontend/README.md` para instalar pacotes NPM, configurar as variáveis de ambiente (apontando para a API local) e arrancar o ambiente de desenvolvimento (geralmente em `http://localhost:3000`).

## Sobre a ARSMART

A ARSMART presta serviços empresariais e tecnológicos de excelência, disponibiliza soluções inovadoras de software e trata do fornecimento de produtos sob solicitação, com foco rigoroso nas necessidades dos parceiros e clientes institucionais em Angola.

---
*Documentação escrita em Português (PT-PT).*
