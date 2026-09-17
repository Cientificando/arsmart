import { redirect } from "next/navigation";

export default async function SolicitarServicoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams({ tipo: "SERVICE" });
  if (sp.servico) params.set("servico", String(sp.servico));
  redirect(`/orcamento?${params.toString()}`);
}
