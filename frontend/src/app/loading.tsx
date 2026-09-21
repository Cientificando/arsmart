import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center animate-pulse">
        <Image 
          src="/icon.svg" 
          alt="A processar..." 
          width={64} 
          height={64} 
          className="animate-bounce"
        />
        <span className="mt-4 text-sm font-medium text-[var(--color-primary)]">A carregar...</span>
      </div>
    </div>
  );
}
