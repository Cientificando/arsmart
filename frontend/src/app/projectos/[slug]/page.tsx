import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { ApiError, getProject } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    return { title: project.name, description: project.description.slice(0, 150) };
  } catch {
    return { title: "Projecto" };
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = await getProject(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          {project.category && <p className="text-[13px] font-medium text-primary">{project.category.name}</p>}
          <h1 className="mt-3 text-4xl md:text-[2.75rem] font-medium leading-tight text-ink">{project.name}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">{project.description}</p>
        </div>

        <dl className="mt-10 grid sm:grid-cols-3 gap-6 max-w-2xl text-[14px]">
          {project.client_name && (
            <div><dt className="text-muted">Cliente</dt><dd className="mt-0.5 font-medium text-ink">{project.client_name}</dd></div>
          )}
          {project.location && (
            <div><dt className="text-muted">Localização</dt><dd className="mt-0.5 font-medium text-ink">{project.location}</dd></div>
          )}
          {project.date && (
            <div><dt className="text-muted">Data</dt><dd className="mt-0.5 font-medium text-ink">{project.date}</dd></div>
          )}
        </dl>

        {project.results && (
          <div className="mt-10 max-w-2xl">
            <h2 className="text-[15px] font-medium text-ink">Resultados</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{project.results}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
