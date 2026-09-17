"use client";

import { useEffect } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-32">
      <Container className="text-center">
        <p className="text-[13px] font-medium text-primary">Erro</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-medium text-ink">Ocorreu um problema.</h1>
        <p className="mt-4 text-[16px] text-muted">
          Não foi possível carregar esta página. Tente novamente dentro de momentos.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={reset}>Tentar novamente</Button>
          <Button href="/" variant="ghost">Voltar ao início</Button>
        </div>
      </Container>
    </section>
  );
}
