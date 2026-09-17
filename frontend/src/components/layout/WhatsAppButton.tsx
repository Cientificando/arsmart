import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ number }: { number?: string }) {
  if (!number) return null;

  const message = encodeURIComponent("Olá, ARSMART. Gostaria de obter informações sobre os vossos serviços.");
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:brightness-95 transition-all"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
