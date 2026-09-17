import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ApiError, getService } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return { title: service.name, description: service.short_description };
  } catch {
    return { title: "Serviço" };
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service;
  try {
    service = await getService(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium text-primary">{service.category.name}</p>
          <h1 className="mt-3 text-4xl md:text-[2.75rem] font-medium leading-tight text-ink">
            {service.name}
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">{service.full_description}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-12 max-w-4xl">
          {service.benefits_list.length > 0 && (
            <div>
              <h2 className="text-[15px] font-medium text-ink">O que inclui</h2>
              <ul className="mt-4 space-y-2.5">
                {service.benefits_list.map((b) => (
                  <li key={b} className="text-[15px] text-ink-soft leading-relaxed pl-4 border-l-2 border-primary">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.process_list.length > 0 && (
            <div>
              <h2 className="text-[15px] font-medium text-ink">Processo</h2>
              <ol className="mt-4 space-y-2.5">
                {service.process_list.map((step, i) => (
                  <li key={step} className="text-[15px] text-ink-soft leading-relaxed">
                    <span className="text-primary font-medium">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="mt-14">
          <Button href={`/orcamento?tipo=SERVICE&servico=${service.id}`} size="lg">
            {service.cta_label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
