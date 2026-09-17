import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-32">
      <Container className="text-center">
        <p className="text-[13px] font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-medium text-ink">Página não encontrada.</h1>
        <p className="mt-4 text-[16px] text-muted">
          A página que procura pode ter sido movida ou já não existe.
        </p>
        <div className="mt-8">
          <Button href="/">Voltar ao início</Button>
        </div>
      </Container>
    </section>
  );
}
