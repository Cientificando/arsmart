import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/ui/Container";
import QuoteRequestForm from "@/components/sections/QuoteRequestForm";
import { getProductCategories, getServices, getSoftwareList } from "@/lib/api";

export const metadata: Metadata = {
  title: "Solicitar Orçamento",
  description: "Solicite um orçamento para um serviço, software, fornecimento ou consultoria junto da ARSMART.",
};

export default async function OrcamentoPage() {
  const [services, softwareList, productCategories] = await Promise.all([
    getServices().catch(() => ({ results: [] as any[] })),
    getSoftwareList().catch(() => ({ results: [] as any[] })),
    getProductCategories().catch(() => ({ results: [] as any[] })),
  ]);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Solicitar orçamento</p>
        <h1 className="mt-3 text-4xl md:text-[2.75rem] font-medium leading-tight text-ink max-w-2xl">
          Conte-nos a sua necessidade.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
          Preencha o formulário abaixo — a ARSMART analisará o seu pedido e entrará em
          contacto com uma proposta.
        </p>

        <div className="mt-12">
          <Suspense fallback={null}>
            <QuoteRequestForm
              services={services.results}
              softwareList={softwareList.results}
              productCategories={productCategories.results}
            />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
