import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getProductCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Fornecimento sob Solicitação",
  description: "Precisa de um produto ou equipamento específico? A ARSMART analisa o pedido e trata do fornecimento.",
};

export default async function FornecimentoPage() {
  const categories = await getProductCategories().catch(() => ({ results: [] as any[] }));

  return (
    <>
      <section className="py-16 md:py-20">
        <Container>
          <p className="text-[13px] font-medium text-primary">Fornecimento sob Solicitação</p>
          <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
            Não encontrou o que procura?
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted max-w-2xl">
            Envie-nos o produto, equipamento ou material de que necessita. A ARSMART analisa
            o pedido e trata do processo de obtenção e fornecimento conforme aplicável.
          </p>
          <div className="mt-8">
            <Button href="/solicitar-fornecimento" size="lg">Solicitar fornecimento</Button>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-ink text-white">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
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
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeader title="Categorias de fornecimento" description="A ARSMART não depende de um catálogo fixo — pode descrever qualquer necessidade." />
          <div className="mt-10">
            {categories.results.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {categories.results.map((c: any) => (
                  <span key={c.id} className="rounded-full border border-border px-4 py-2 text-[14px] text-ink-soft">
                    {c.name}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState message="Categorias a ser configuradas." />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
