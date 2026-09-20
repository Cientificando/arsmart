import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = { title: "Termos e Condições" };

export default function TermosPage() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-medium text-ink">Termos e Condições</h1>
          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
            
            <p>
              O acesso e utilização deste website implicam a aceitação dos presentes termos.
              A ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA disponibiliza este
              site com fins informativos e para recepção de pedidos comerciais.
            </p>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Pedidos e fornecimento</h2>
              <p>
                Os pedidos de serviço, fornecimento, demonstração ou proposta submetidos
                através deste site não constituem, por si só, um contrato — a relação
                comercial apenas se formaliza após aceitação expressa de uma proposta por
                ambas as partes. O website não funciona como uma loja online: os produtos
                mencionados são tratados através de um modelo de fornecimento sob solicitação,
                sujeito a análise de viabilidade e disponibilidade junto de fornecedores.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Propriedade intelectual</h2>
              <p>
                O logótipo, conteúdos e materiais disponibilizados neste website são
                propriedade da ARSMART ou dos respectivos titulares e não podem ser
                reproduzidos sem autorização prévia.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Limitações de responsabilidade</h2>
              <p>
                A ARSMART envida esforços para manter a informação deste website actualizada,
                mas não garante a ausência de erros ou omissões. A disponibilidade de produtos
                e serviços de terceiros está sujeita à confirmação junto dos respectivos
                fornecedores.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Contactos</h2>
              <p>
                Para qualquer questão relacionada com estes termos, contacte a ARSMART através
                dos canais disponibilizados na página de Contactos.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
