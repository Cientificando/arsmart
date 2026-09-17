import Link from "next/link";
import { Wrench, MonitorSmartphone, PackageSearch, Calculator, Lightbulb, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import HeroGraphic from "@/components/sections/HeroGraphic";
import { getProjects, getServices, getSoftwareList } from "@/lib/api";

export default async function HomePage() {
  const [services, softwareList, projects] = await Promise.all([
    getServices({ featured: true }).catch(() => ({ results: [] as any[] })),
    getSoftwareList().catch(() => ({ results: [] as any[] })),
    getProjects({ featured: true }).catch(() => ({ results: [] as any[] })),
  ]);

  const featuredSoftware = softwareList.results[0];

  return (
    <>
      {/* HERO */}
      <section className="pt-16 md:pt-20 pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[2.75rem] md:text-[3.4rem] leading-[1.08] font-medium text-ink max-w-xl">
                Serviços e soluções para empresas e organizações.
              </h1>
              <p className="mt-6 text-[18px] leading-relaxed text-muted max-w-lg">
                A ARSMART presta serviços empresariais e tecnológicos, disponibiliza
                soluções de software e trata do fornecimento de produtos sob solicitação.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/orcamento?tipo=SERVICE" size="lg">
                  Solicitar serviço
                </Button>
                <Button href="/solicitar-fornecimento" size="lg" variant="ghost">
                  Solicitar fornecimento
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroGraphic />
            </div>
          </div>
        </Container>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="py-20 bg-surface">
        <Container>
          <SectionHeader title="O que fazemos" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <MonitorSmartphone className="text-primary" size={28} strokeWidth={1.6} />
              <h3 className="mt-4 text-[17px] font-medium text-ink">Informática e Tecnologia</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Serviços de informática e soluções tecnológicas para as necessidades digitais
                e operacionais de empresas e organizações.
              </p>
            </Card>
            <Card>
              <Wrench className="text-primary" size={28} strokeWidth={1.6} />
              <h3 className="mt-4 text-[17px] font-medium text-ink">Software de Gestão</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Comercialização e licenciamento de soluções de software de gestão, incluindo
                o NEGOMIL.
              </p>
            </Card>
            <Card>
              <Calculator className="text-primary" size={28} strokeWidth={1.6} />
              <h3 className="mt-4 text-[17px] font-medium text-ink">Contabilidade e Serviços Empresariais</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Prestação de serviços contabilísticos e apoio às necessidades de gestão e
                organização empresarial.
              </p>
            </Card>
            <Card>
              <Lightbulb className="text-primary" size={28} strokeWidth={1.6} />
              <h3 className="mt-4 text-[17px] font-medium text-ink">Consultoria</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Serviços de consultoria orientados para as necessidades específicas de
                empresas e organizações.
              </p>
            </Card>
            <Card>
              <PackageSearch className="text-primary" size={28} strokeWidth={1.6} />
              <h3 className="mt-4 text-[17px] font-medium text-ink">Fornecimento sob Solicitação</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Necessita de um produto ou equipamento específico? A ARSMART analisa o pedido
                e trata do processo de obtenção e fornecimento.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* SERVIÇOS EM DESTAQUE */}
      {services.results.length > 0 && (
        <section className="py-20 bg-surface">
          <Container>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <SectionHeader title="Serviços em destaque" />
              <Link href="/servicos" className="text-[15px] font-medium text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all">
                Ver todos os serviços <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {services.results.slice(0, 3).map((service: any) => (
                <Link key={service.id} href={`/servicos/${service.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors">
                    <p className="text-[13px] text-primary font-medium">{service.category.name}</p>
                    <h3 className="mt-2 text-[18px] font-medium text-ink">{service.name}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{service.short_description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* SOFTWARE */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[13px] font-medium text-primary">Soluções de Software</p>
              <h2 className="mt-3 text-3xl md:text-[2.25rem] font-medium leading-tight text-ink">
                {featuredSoftware ? featuredSoftware.name : "Software de gestão para o seu negócio"}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                {featuredSoftware
                  ? featuredSoftware.short_description
                  : "A ARSMART disponibiliza e comercializa soluções de software orientadas para a gestão e operação empresarial."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={featuredSoftware ? `/solucoes/${featuredSoftware.slug}` : "/solucoes"}>
                  Conhecer a solução
                </Button>
                <Button href="/solicitar-demonstracao" variant="ghost">
                  Solicitar demonstração
                </Button>
              </div>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-ink p-10 flex items-center justify-center min-h-[280px]">
              <p className="text-white/30 text-[14px]">Imagem/screenshot do software</p>
            </div>
          </div>
        </Container>
      </section>

      {/* FORNECIMENTO */}
      <section className="py-20 bg-ink text-white">
        <Container>
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-[2.25rem] font-medium leading-tight">
              Fornecimento sob solicitação
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              Procura um produto ou equipamento específico? Envie-nos a sua necessidade.
              A ARSMART analisa o pedido e trata do processo de fornecimento.
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {[
              ["01", "Solicitação", "O cliente apresenta o produto ou equipamento de que necessita."],
              ["02", "Análise", "A ARSMART analisa as especificações e a viabilidade do pedido."],
              ["03", "Obtenção", "A equipa procura e obtém a solução junto de fornecedores aplicáveis."],
              ["04", "Proposta", "É apresentada a proposta correspondente ao cliente."],
              ["05", "Aquisição", "Após aprovação, procede-se ao processo de aquisição."],
              ["06", "Fornecimento", "O produto é disponibilizado ao cliente."],
            ].map(([n, title, desc]) => (
              <div key={n}>
                <span className="text-[13px] text-primary font-medium">{n}</span>
                <h3 className="mt-2 text-[16px] font-medium">{title}</h3>
                <p className="mt-1.5 text-[14px] text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Button href="/solicitar-fornecimento">Solicitar fornecimento</Button>
          </div>
        </Container>
      </section>

      {/* PORQUÊ ARSMART */}
      <section className="py-20">
        <Container>
          <SectionHeader title="Porquê a ARSMART" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {[
              "Confiança",
              "Compromisso",
              "Profissionalismo",
              "Soluções orientadas às necessidades",
              "Capacidade de resposta",
            ].map((item) => (
              <p key={item} className="text-[15px] leading-relaxed text-ink-soft border-l-2 border-primary pl-4">
                {item}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* PROJECTOS */}
      <section className="py-20 bg-surface">
        <Container>
          <SectionHeader title="Projectos" description="Trabalhos reais desenvolvidos pela ARSMART." />
          <div className="mt-12">
            {projects.results.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {projects.results.slice(0, 3).map((project: any) => (
                  <Link key={project.id} href={`/projectos/${project.slug}`}>
                    <Card className="h-full hover:border-primary transition-colors">
                      <h3 className="text-[17px] font-medium text-ink">{project.name}</h3>
                      {project.location && <p className="mt-1 text-[13px] text-muted">{project.location}</p>}
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="Nenhum projecto publicado neste momento." />
            )}
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="py-24">
        <Container>
          <div className="rounded-[var(--radius-lg)] bg-primary px-8 py-16 text-center">
            <h2 className="text-3xl md:text-[2.5rem] font-medium text-white leading-tight">
              Tem uma necessidade? Fale com a ARSMART.
            </h2>
            <div className="mt-8">
              <Button href="/orcamento" variant="secondary" size="lg">
                Solicitar orçamento
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
