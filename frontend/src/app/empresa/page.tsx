import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getBusinessAreas, getCompanyProfile, getTeamMembers, getTestimonials } from "@/lib/api";

export const metadata: Metadata = {
  title: "Empresa",
  description: "Conheça a ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA.",
};

const statusTone: Record<string, "success" | "info" | "neutral" | "warning"> = {
  ACTIVE: "success",
  AVAILABLE_ON_REQUEST: "info",
  CONSULTATION: "neutral",
  DEVELOPMENT: "warning",
  INACTIVE: "neutral",
};

export default async function EmpresaPage() {
  const [company, businessAreas, team, testimonials] = await Promise.all([
    getCompanyProfile().catch(() => null),
    getBusinessAreas().catch(() => ({ results: [] as any[] })),
    getTeamMembers().catch(() => ({ results: [] as any[] })),
    getTestimonials().catch(() => ({ results: [] as any[] })),
  ]);

  return (
    <>
      <section className="py-16 md:py-20">
        <Container>
          <p className="text-[13px] font-medium text-primary">Empresa</p>
          <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
            ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
            {company?.description ||
              "ARSMART é uma empresa angolana sediada no Dundo, Lunda Norte, dedicada principalmente à prestação de serviços, soluções empresariais, tecnologia, software e fornecimento sob solicitação."}
          </p>
        </Container>
      </section>

      <section className="py-16 bg-surface">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-[15px] font-medium text-primary">Missão</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                {company?.mission || "Conteúdo a definir pelo administrador."}
              </p>
            </Card>
            <Card>
              <h3 className="text-[15px] font-medium text-primary">Visão</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                {company?.vision || "Conteúdo a definir pelo administrador."}
              </p>
            </Card>
            <Card>
              <h3 className="text-[15px] font-medium text-primary">Valores</h3>
              {company?.values_list && company.values_list.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {company.values_list.map((v) => (
                    <li key={v.name} className="text-[14px] leading-relaxed text-ink-soft">
                      <span className="font-medium text-ink">{v.name}.</span> {v.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">Conteúdo a definir pelo administrador.</p>
              )}
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader title="Forma de trabalhar" />
          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-3xl">
            {[
              "O cliente apresenta a necessidade — serviço, software ou fornecimento.",
              "A ARSMART analisa o pedido e apresenta uma proposta.",
              "Após aprovação, o serviço é executado ou o processo de aquisição é iniciado.",
              "O pedido é acompanhado até à conclusão.",
            ].map((step) => (
              <p key={step} className="text-[15px] leading-relaxed text-ink-soft border-l-2 border-primary pl-4">
                {step}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-surface">
        <Container>
          <SectionHeader
            title="Áreas de actuação"
            description="O objecto social da ARSMART é amplo. A comunicação comercial mantém-se centrada nas áreas realmente em operação — as restantes ficam disponíveis sob consulta."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessAreas.results.map((area: any) => (
              <div
                key={area.id}
                className="rounded-[var(--radius-md)] border border-border p-5 flex items-start justify-between gap-3 bg-white"
              >
                <h3 className="text-[15px] font-medium text-ink">{area.name}</h3>
                <Badge tone={statusTone[area.status] || "neutral"}>{area.status_display}</Badge>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {team.results.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeader title="Equipa" />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.results.map((member: any) => (
                <div key={member.id}>
                  <h3 className="text-[15px] font-medium text-ink">{member.name}</h3>
                  <p className="text-[13px] text-primary">{member.role}</p>
                  {member.bio && <p className="mt-2 text-[13px] text-muted leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {testimonials.results.length > 0 && (
        <section className="py-16 bg-surface">
          <Container>
            <SectionHeader title="O que dizem os nossos clientes" />
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {testimonials.results.map((t: any) => (
                <Card key={t.id}>
                  <p className="text-[15px] leading-relaxed text-ink-soft italic">&ldquo;{t.content}&rdquo;</p>
                  <p className="mt-4 text-[14px] font-medium text-ink">
                    {t.author_name}
                    {t.company_name && <span className="text-muted font-normal"> — {t.company_name}</span>}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <SectionHeader title="Informação empresarial" />
          <div className="mt-8 max-w-2xl grid sm:grid-cols-2 gap-x-8 gap-y-4 text-[14px]">
            <InfoRow label="Firma" value={company?.legal_name || "ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA"} />
            <InfoRow label="NIF" value={company?.nif || "5002476959"} />
            <InfoRow label="Matrícula" value={company?.registration_number || "13222-25/250420"} />
            <InfoRow label="Forma jurídica" value={company?.legal_form || "Sociedade Unipessoal por Quotas (SU, LDA)"} />
            <InfoRow label="Sede" value={`${company?.municipality || "Dundo"}, ${company?.province || "Lunda Norte"}, ${company?.country || "Angola"}`} />
            <InfoRow label="Capital social" value={company ? `${company.capital} Kz` : "100.000,00 Kz"} />
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
