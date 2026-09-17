import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-medium text-ink">Política de Privacidade</h1>
          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
            <p className="rounded-[var(--radius-md)] border border-[#F1E0B5] bg-[#FBF3E1] px-4 py-3 text-[14px] text-warning">
              Conteúdo provisório — a rever por assessoria jurídica antes da publicação
              definitiva.
            </p>
            <p>
              A ARSMART - Comércio Geral e Prestação de Serviços (SU), LDA ("ARSMART")
              respeita a privacidade dos utilizadores deste website. Esta política descreve,
              em termos gerais, como os dados pessoais submetidos através dos formulários do
              site são recolhidos e utilizados.
            </p>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Dados recolhidos</h2>
              <p>
                Através dos formulários de solicitação de serviço, fornecimento, demonstração,
                proposta e contacto geral, podemos recolher: nome, nome de empresa, telefone,
                email, e a descrição da necessidade ou mensagem submetida, incluindo anexos
                quando enviados.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Finalidade</h2>
              <p>
                Os dados recolhidos são utilizados exclusivamente para responder ao pedido
                efectuado — análise de necessidades, elaboração de propostas, agendamento de
                demonstrações ou resposta a mensagens de contacto — e não são partilhados com
                terceiros para fins comerciais alheios ao pedido.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Conservação</h2>
              <p>
                Os dados são conservados pelo período necessário ao tratamento do pedido e ao
                cumprimento de obrigações legais aplicáveis.
              </p>
            </div>

            <div>
              <h2 className="text-[17px] font-medium text-ink mb-2">Direitos do utilizador</h2>
              <p>
                O utilizador pode, a qualquer momento, solicitar o acesso, rectificação ou
                eliminação dos seus dados através dos contactos disponibilizados na página de
                Contactos.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
