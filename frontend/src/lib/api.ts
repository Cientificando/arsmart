import type {
  BusinessArea,
  CompanyProfile,
  FAQ,
  Paginated,
  ProductCategory,
  ProjectDetail,
  ProjectListItem,
  ServiceCategory,
  ServiceDetail,
  ServiceListItem,
  SoftwareDetail,
  SoftwareListItem,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    // Conteúdo institucional muda pouco: cache curto, revalidado ao fim de 60s.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    let detail = `Erro ao comunicar com o servidor (${res.status}).`;
    try {
      const body = await res.json();
      detail = typeof body === "string" ? body : JSON.stringify(body);
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new ApiError(detail, res.status);
  }
  return res.json();
}

export { ApiError };

// --- Empresa -------------------------------------------------------
export const getCompanyProfile = () => apiFetch<CompanyProfile>("/company/");
export const getFAQs = () => apiFetch<Paginated<FAQ>>("/faqs/").catch(() => ({ count: 0, next: null, previous: null, results: [] }));
export const getTeamMembers = () => apiFetch<Paginated<import("@/types").TeamMember>>("/team/").catch(() => ({ count: 0, next: null, previous: null, results: [] }));
export const getTestimonials = () => apiFetch<Paginated<import("@/types").Testimonial>>("/testimonials/").catch(() => ({ count: 0, next: null, previous: null, results: [] }));

// --- Serviços --------------------------------------------------------
export const getServices = (params?: { featured?: boolean; category?: string }) => {
  const qs = new URLSearchParams();
  if (params?.featured) qs.set("is_featured", "true");
  if (params?.category) qs.set("category__slug", params.category);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<Paginated<ServiceListItem>>(`/services/${suffix}`);
};
export const getService = (slug: string) => apiFetch<ServiceDetail>(`/services/${slug}/`);
export const getServiceCategories = () => apiFetch<Paginated<ServiceCategory>>("/service-categories/");
export const getBusinessAreas = () => apiFetch<Paginated<BusinessArea>>("/business-areas/");

// --- Software --------------------------------------------------------
export const getSoftwareList = () => apiFetch<Paginated<SoftwareListItem>>("/software/");
export const getSoftware = (slug: string) => apiFetch<SoftwareDetail>(`/software/${slug}/`);

// --- Fornecimento ------------------------------------------------------
export const getProductCategories = () => apiFetch<Paginated<ProductCategory>>("/product-categories/");

// --- Projectos ---------------------------------------------------------
export const getProjects = (params?: { featured?: boolean }) => {
  const qs = new URLSearchParams();
  if (params?.featured) qs.set("is_featured", "true");
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<Paginated<ProjectListItem>>(`/projects/${suffix}`);
};
export const getProject = (slug: string) => apiFetch<ProjectDetail>(`/projects/${slug}/`);

// --- Formulários (mutações — sempre sem cache) --------------------------
export interface QuoteRequestPayload {
  customer_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  request_type: string;
  service?: number;
  software?: number;
  product_category?: number;
  subject: string;
  description: string;
  quantity?: string;
  budget?: string;
  location?: string;
  deadline?: string;
  privacy_consent: boolean;
}

export async function submitQuoteRequest(payload: QuoteRequestPayload) {
  const res = await fetch(`${API_URL}/quote-requests/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(JSON.stringify(data), res.status);
  }
  return data as { reference: string; message: string };
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  privacy_consent: boolean;
}

export async function submitContactMessage(payload: ContactMessagePayload) {
  const res = await fetch(`${API_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(JSON.stringify(data), res.status);
  }
  return data as { message: string };
}
