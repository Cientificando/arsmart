import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ApiError, getSoftware } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const sw = await getSoftware(slug);
    return { title: sw.name, description: sw.short_description };
  } catch {
    return { title: "Software" };
  }
}

export default async function SoftwareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let sw;
  try {
    sw = await getSoftware(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          {sw.category && <p className="text-[13px] font-medium text-primary">{sw.category}</p>}
          <h1 className="mt-3 text-4xl md:text-[2.75rem] font-medium leading-tight text-ink">{sw.name}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">{sw.full_description}</p>
        </div>

        {sw.cover_image && (
          <div className="mt-14 max-w-4xl">
            <div className="aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-border">
              <img src={sw.cover_image} alt={`Capa do software ${sw.name}`} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {sw.screenshots && sw.screenshots.length > 0 && (
          <div className="mt-14 max-w-4xl">
            <h2 className="text-[15px] font-medium text-ink mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sw.screenshots.map((screenshot: any) => (
                <div key={screenshot.id} className="aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-border">
                  <img src={screenshot.image} alt={screenshot.caption || sw.name} className="w-full h-full object-cover" />
                  {screenshot.caption && (
                    <p className="mt-2 text-[13px] text-muted text-center">{screenshot.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 grid md:grid-cols-2 gap-12 max-w-4xl">
          {sw.features_list.length > 0 && (
            <div>
              <h2 className="text-[15px] font-medium text-ink">Funcionalidades</h2>
              <ul className="mt-4 space-y-2.5">
                {sw.features_list.map((f) => (
                  <li key={f} className="text-[15px] text-ink-soft leading-relaxed pl-4 border-l-2 border-primary">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sw.benefits_list.length > 0 && (
            <div>
              <h2 className="text-[15px] font-medium text-ink">Benefícios</h2>
              <ul className="mt-4 space-y-2.5">
                {sw.benefits_list.map((b) => (
                  <li key={b} className="text-[15px] text-ink-soft leading-relaxed pl-4 border-l-2 border-primary">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {sw.video_url && (
          <div className="mt-14 max-w-3xl">
            <h2 className="text-[15px] font-medium text-ink mb-4">Vídeo</h2>
            <div className="aspect-video rounded-[var(--radius-lg)] overflow-hidden border border-border">
              <iframe src={sw.video_url} className="w-full h-full" allowFullScreen title={`Vídeo — ${sw.name}`} />
            </div>
          </div>
        )}

        {(sw.target_audience || sw.requirements || sw.license_type_display) && (
          <div className="mt-14 grid sm:grid-cols-3 gap-8 max-w-3xl border-t border-border pt-10">
            {sw.target_audience && (
              <div>
                <h3 className="text-[13px] font-medium text-muted">Público-alvo</h3>
                <p className="mt-1.5 text-[14px] text-ink-soft leading-relaxed">{sw.target_audience}</p>
              </div>
            )}
            {sw.requirements && (
              <div>
                <h3 className="text-[13px] font-medium text-muted">Requisitos</h3>
                <p className="mt-1.5 text-[14px] text-ink-soft leading-relaxed">{sw.requirements}</p>
              </div>
            )}
            <div>
              <h3 className="text-[13px] font-medium text-muted">Modalidade de licença</h3>
              <p className="mt-1.5 text-[14px] text-ink-soft leading-relaxed">{sw.license_type_display}</p>
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-wrap gap-4">
          <Button href={`/solicitar-demonstracao?software=${sw.id}`} size="lg">
            Solicitar demonstração
          </Button>
          <Button href={`/solicitar-proposta?software=${sw.id}`} size="lg" variant="ghost">
            Solicitar proposta
          </Button>
        </div>
      </Container>
    </section>
  );
}
