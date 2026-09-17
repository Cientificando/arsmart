import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getProjects } from "@/lib/api";

export const metadata: Metadata = {
  title: "Projectos",
  description: "Projectos e experiência da ARSMART.",
};

export default async function ProjectosPage() {
  const projects = await getProjects().catch(() => ({ results: [] as any[] }));

  return (
    <section className="py-16 md:py-20">
      <Container>
        <p className="text-[13px] font-medium text-primary">Projectos</p>
        <h1 className="mt-3 text-4xl md:text-[3rem] font-medium leading-tight text-ink max-w-2xl">
          Experiência e trabalhos realizados.
        </h1>

        <div className="mt-14">
          {projects.results.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {projects.results.map((project: any) => (
                <Link key={project.id} href={`/projectos/${project.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors">
                    {project.category && <p className="text-[13px] text-primary font-medium">{project.category.name}</p>}
                    <h2 className="mt-2 text-[18px] font-medium text-ink">{project.name}</h2>
                    {project.location && <p className="mt-2 text-[14px] text-muted">{project.location}</p>}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Não existem projectos publicados neste momento." />
          )}
        </div>
      </Container>
    </section>
  );
}
