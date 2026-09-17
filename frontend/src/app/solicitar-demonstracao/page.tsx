import { redirect } from "next/navigation";

export default async function SolicitarDemonstracaoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams({ tipo: "DEMO" });
  if (sp.software) params.set("software", String(sp.software));
  redirect(`/orcamento?${params.toString()}`);
}
