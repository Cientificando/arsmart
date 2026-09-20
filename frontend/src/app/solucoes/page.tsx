import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getSoftwareList } from "@/lib/api";

export const metadata: Metadata = {
  title: "Soluções de Software",
  description: "Soluções de software de gestão comercializadas e licenciadas pela ARSMART, incluindo o NEGOMIL.",
};

export default async function SolucoesPage() {
  const softwareList = await getSoftwareList().catch(() => ({ results: [] as any[] }));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Soluções de Software</p>
        <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
          Software de gestão para a operação do seu negócio.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
          A ARSMART disponibiliza e comercializa soluções de software orientadas para a
          gestão e operação empresarial.
        </p>

        <div className="mt-14">
          {softwareList.results.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {softwareList.results.map((sw: any) => (
                <Link key={sw.id} href={`/solucoes/${sw.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors flex flex-col">
                    {sw.cover_image && (
                      <div className="aspect-video rounded-[var(--radius-md)] overflow-hidden border border-border mb-4">
                        <img src={sw.cover_image} alt={sw.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {sw.category && <p className="text-[13px] text-primary font-medium">{sw.category}</p>}
                    <h2 className="mt-2 text-[20px] font-medium text-ink">{sw.name}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{sw.short_description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Não existem soluções de software publicadas neste momento." />
          )}
        </div>
      </Container>
    </section>
  );
}
