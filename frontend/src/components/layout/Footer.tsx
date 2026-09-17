import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import type { CompanyProfile } from "@/types";

export default function Footer({ company }: { company: CompanyProfile | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80 mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="[&_text]:fill-white">
              <Logo dark />
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60 max-w-[240px]">
              Serviços e soluções para empresas e organizações.
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-white mb-4">Empresa</h3>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/60">
              <li><Link href="/empresa" className="hover:text-white transition-colors">Sobre</Link></li>
              <li><Link href="/servicos" className="hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="/solucoes" className="hover:text-white transition-colors">Soluções</Link></li>
              <li><Link href="/fornecimento" className="hover:text-white transition-colors">Fornecimento</Link></li>
              <li><Link href="/projectos" className="hover:text-white transition-colors">Projectos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-white mb-4">Contactos</h3>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/60">
              <li>{company?.phone || "923 766 892"}</li>
              <li>{company?.email || "aristidethidewalla@gmail.com"}</li>
              <li>{company?.municipality || "Dundo"}, {company?.province || "Lunda Norte"}, {company?.country || "Angola"}</li>
              <li><Link href="/contactos" className="hover:text-white transition-colors">Formulário de contacto</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-white mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5 text-[14px] text-white/60">
              <li><Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-white transition-colors">Termos e Condições</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[13px] text-white/40">
          <p>
            © {year} {company?.legal_name || "ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA"}
          </p>
          <p>NIF {company?.nif || "5002476959"}</p>
        </div>
      </Container>
    </footer>
  );
}
