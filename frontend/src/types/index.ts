export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface ServiceListItem {
  id: number;
  name: string;
  slug: string;
  category: ServiceCategory;
  short_description: string;
  image: string | null;
  is_featured: boolean;
  order: number;
}

export interface ServiceDetail extends Omit<ServiceListItem, "short_description"> {
  short_description: string;
  full_description: string;
  benefits_list: string[];
  process_list: string[];
  cta_label: string;
}

export interface CompanyValue {
  id: number;
  name: string;
  description: string;
  order: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedin_url: string;
  order: number;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string;
  company_name: string;
  content: string;
  order: number;
}

export interface BusinessArea {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "ACTIVE" | "AVAILABLE_ON_REQUEST" | "CONSULTATION" | "DEVELOPMENT" | "INACTIVE";
  status_display: string;
  order: number;
}

export interface SoftwareListItem {
  id: number;
  name: string;
  slug: string;
  developer: string;
  category: string;
  short_description: string;
  cover_image: string | null;
  is_featured: boolean;
}

export interface SoftwareScreenshot {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface SoftwareDetail extends Omit<SoftwareListItem, "short_description"> {
  short_description: string;
  full_description: string;
  features_list: string[];
  benefits_list: string[];
  target_audience: string;
  requirements: string;
  license_type: string;
  license_type_display: string;
  price_note: string;
  documentation_url: string;
  video_url: string;
  screenshots: SoftwareScreenshot[];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectListItem {
  id: number;
  name: string;
  slug: string;
  category: ProjectCategory | null;
  client_name: string;
  image: string | null;
  date: string | null;
  location: string;
  is_featured: boolean;
}

export interface ProjectDetail extends ProjectListItem {
  description: string;
  services_involved: string[];
  results: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CompanyProfile {
  legal_name: string;
  trade_name: string;
  nif: string;
  registration_number: string;
  legal_form: string;
  founded_year: number;
  capital: string;
  address: string;
  province: string;
  municipality: string;
  country: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  description: string;
  mission: string;
  vision: string;
  values_list: { name: string; description: string }[];
  logo: string | null;
  favicon: string | null;
  google_maps_url: string;
  social_links: SocialLink[];
}

export type RequestType = "SERVICE" | "SOFTWARE" | "SUPPLY" | "CONSULTING" | "DEMO" | "PROPOSAL" | "OTHER";

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
