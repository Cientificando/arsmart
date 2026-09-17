import type { Metadata } from "next";
import { MapPin, Mail, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/sections/ContactForm";
import { getCompanyProfile, getFAQs } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contactos",
  description: "Entre em contacto com a ARSMART - Comércio Geral e Prestação de Serviços.",
};

export default async function ContactosPage() {
  const [company, faqs] = await Promise.all([
    getCompanyProfile().catch(() => null),
    getFAQs().catch(() => ({ results: [] as any[] })),
  ]);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Contactos</p>
        <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
          Fale com a ARSMART.
        </h1>

        <div className="mt-14 grid lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
                <p className="text-[15px] text-ink-soft leading-relaxed">
                  {company?.address ? `${company.address}, ` : ""}
                  {company?.municipality || "Dundo"}, {company?.province || "Lunda Norte"}, {company?.country || "Angola"}
                </p>
              </div>
              {company?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={20} />
                  <p className="text-[15px] text-ink-soft">{company.phone}</p>
                </div>
              )}
              {company?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={20} />
                  <p className="text-[15px] text-ink-soft">{company.email}</p>
                </div>
              )}
            </div>

            {company?.google_maps_url && (
              <div className="mt-8 aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-border">
                <iframe
                  src={company.google_maps_url}
                  className="w-full h-full"
                  loading="lazy"
                  title="Localização ARSMART"
                />
              </div>
            )}

            {faqs.results.length > 0 && (
              <div className="mt-12">
                <h2 className="text-[17px] font-medium text-ink mb-4">Perguntas frequentes</h2>
                <div className="space-y-4">
                  {faqs.results.map((faq: any) => (
                    <details key={faq.id} className="border-b border-border pb-4">
                      <summary className="text-[15px] font-medium text-ink cursor-pointer">{faq.question}</summary>
                      <p className="mt-2 text-[14px] text-muted leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
