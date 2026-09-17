"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

const links = [
  { href: "/empresa", label: "Empresa" },
  { href: "/servicos", label: "Serviços" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/fornecimento", label: "Fornecimento" },
  { href: "/projectos", label: "Projectos" },
  { href: "/contactos", label: "Contactos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-ink-soft hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/orcamento" size="md">
            Solicitar orçamento
          </Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-ink"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white px-6 py-6 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-[16px] text-ink-soft border-b border-border last:border-0"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button href="/orcamento" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Solicitar orçamento
          </Button>
        </div>
      )}
    </header>
  );
}
