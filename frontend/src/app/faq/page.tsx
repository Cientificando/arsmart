import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import { getFAQs } from "@/lib/api";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Respostas às perguntas mais frequentes sobre os serviços, software e fornecimento da ARSMART.",
};

export default async function FaqPage() {
  const faqs = await getFAQs().catch(() => ({ results: [] as any[] }));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">FAQ</p>
        <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
          Perguntas frequentes
        </h1>

        <div className="mt-14 max-w-2xl">
          {faqs.results.length > 0 ? (
            <div className="space-y-5">
              {faqs.results.map((faq: any) => (
                <details key={faq.id} className="border-b border-border pb-5">
                  <summary className="text-[16px] font-medium text-ink cursor-pointer">{faq.question}</summary>
                  <p className="mt-3 text-[15px] text-muted leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhuma pergunta frequente publicada neste momento." />
          )}
        </div>
      </Container>
    </section>
  );
}
