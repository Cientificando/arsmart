import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SupplyRequestForm from "@/components/sections/SupplyRequestForm";
import { getProductCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Solicitar Fornecimento",
  description: "Solicite à ARSMART a obtenção e fornecimento de um produto, equipamento ou material específico.",
};

export default async function SolicitarFornecimentoPage() {
  const categories = await getProductCategories().catch(() => ({ results: [] as any[] }));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Solicitar fornecimento</p>
        <h1 className="mt-3 text-4xl md:text-[2.75rem] font-medium leading-tight text-ink max-w-2xl">
          Não encontrou o que procura?
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
          Envie-nos o produto, equipamento ou material de que necessita. A ARSMART analisa
          o pedido e trata do processo de obtenção e fornecimento conforme aplicável.
        </p>

        <div className="mt-12">
          <SupplyRequestForm categories={categories.results} />
        </div>
      </Container>
    </section>
  );
}
