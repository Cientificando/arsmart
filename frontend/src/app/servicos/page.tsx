import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { getServices } from "@/lib/api";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Conheça os serviços prestados pela ARSMART: informática, contabilidade, gestão e consultoria.",
};

export default async function ServicosPage() {
  const services = await getServices().catch(() => ({ results: [] as any[] }));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Serviços</p>
        <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
          Informática, contabilidade e consultoria orientadas ao seu negócio.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
          Prestamos serviços empresariais e tecnológicos, analisando cada pedido e
          acompanhando a execução até à conclusão.
        </p>

        <div className="mt-14">
          {services.results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.results.map((service: any) => (
                <Link key={service.id} href={`/servicos/${service.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors">
                    <p className="text-[13px] text-primary font-medium">{service.category.name}</p>
                    <h2 className="mt-2 text-[18px] font-medium text-ink">{service.name}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{service.short_description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              message="Não existem serviços publicados neste momento."
              action={<Button href="/contactos" variant="ghost">Contactar a ARSMART</Button>}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
