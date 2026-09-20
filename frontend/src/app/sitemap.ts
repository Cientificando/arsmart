import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arsmart.co.ao";

async function fetchSlugs(endpoint: string, field = "slug"): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((item: Record<string, string>) => item[field]).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "", "/empresa", "/servicos", "/solucoes", "/fornecimento", "/projectos",
    "/contactos", "/orcamento", "/faq", "/politica-de-privacidade", "/termos",
  ];

  const [serviceSlugs, softwareSlugs, projectSlugs] = await Promise.all([
    fetchSlugs("/services/"),
    fetchSlugs("/software/"),
    fetchSlugs("/projects/"),
  ]);

  const dynamicRoutes = [
    ...serviceSlugs.map((s) => `/servicos/${s}`),
    ...softwareSlugs.map((s) => `/solucoes/${s}`),
    ...projectSlugs.map((s) => `/projectos/${s}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.7,
  }));
}
