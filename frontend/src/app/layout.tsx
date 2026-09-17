import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getCompanyProfile } from "@/lib/api";

const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
  weight: "500 700",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARSMART | Serviços, Tecnologia e Soluções Empresariais",
    template: "%s | ARSMART",
  },
  description:
    "ARSMART - Comércio Geral e Prestação de Serviços. Soluções empresariais, tecnologia, software, consultoria e fornecimento sob solicitação em Angola.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompanyProfile().catch(() => null);

  return (
    <html lang="pt" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer company={company} />
        <WhatsAppButton number={company?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
      </body>
    </html>
  );
}
