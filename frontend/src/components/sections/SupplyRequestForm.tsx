"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import FormField, { inputClasses } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { ApiError, submitQuoteRequest } from "@/lib/api";
import type { ProductCategory } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

export default function SupplyRequestForm({ categories }: { categories: ProductCategory[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGeneralError("");

    const form = new FormData(e.currentTarget);
    const product = String(form.get("product") || "");

    try {
      const result = await submitQuoteRequest({
        customer_name: String(form.get("customer_name") || ""),
        company_name: String(form.get("company_name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        request_type: "SUPPLY",
        product_category: form.get("product_category") ? Number(form.get("product_category")) : undefined,
        subject: product || "Pedido de fornecimento",
        description: String(form.get("specifications") || form.get("notes") || product),
        quantity: String(form.get("quantity") || ""),
        privacy_consent: form.get("privacy_consent") === "on",
      });
      setReference(result.reference);
      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError) {
        try {
          const parsed = JSON.parse(err.message);
          const fieldErrors: Record<string, string> = {};
          Object.entries(parsed).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value.join(" ") : String(value);
          });
          setErrors(fieldErrors);
        } catch {
          setGeneralError("Não foi possível enviar o pedido. Tente novamente.");
        }
      } else {
        setGeneralError("Não foi possível enviar o pedido. Verifique a sua ligação e tente novamente.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[#CDEAD9] bg-[#EAF6F0] p-10 text-center max-w-lg">
        <CheckCircle2 className="mx-auto text-success" size={40} strokeWidth={1.5} />
        <h2 className="mt-4 text-[19px] font-medium text-ink">Pedido recebido com sucesso.</h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          A sua referência é <span className="font-medium text-ink">{reference}</span>. A equipa
          da ARSMART entrará em contacto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Nome" htmlFor="customer_name" required error={errors.customer_name}>
          <input id="customer_name" name="customer_name" required className={inputClasses} />
        </FormField>
        <FormField label="Empresa" htmlFor="company_name" error={errors.company_name}>
          <input id="company_name" name="company_name" className={inputClasses} />
        </FormField>
        <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" className={inputClasses} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" required className={inputClasses} />
        </FormField>
      </div>

      <FormField label="Categoria" htmlFor="product_category" error={errors.product_category}>
        <select id="product_category" name="product_category" className={inputClasses}>
          <option value="">Seleccione uma categoria (opcional)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Produto pretendido" htmlFor="product" required error={errors.subject}>
        <input id="product" name="product" required className={inputClasses} placeholder="Ex: 10 computadores portáteis" />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Quantidade" htmlFor="quantity" error={errors.quantity}>
          <input id="quantity" name="quantity" className={inputClasses} />
        </FormField>
      </div>

      <FormField label="Especificações" htmlFor="specifications" error={errors.description}>
        <textarea id="specifications" name="specifications" rows={4} className={inputClasses} placeholder="Marca, modelo, características técnicas, prazo desejado, etc." />
      </FormField>

      <FormField label="Observações" htmlFor="notes" error={errors.notes}>
        <textarea id="notes" name="notes" rows={3} className={inputClasses} />
      </FormField>

      <label className="flex items-start gap-3 text-[14px] text-ink-soft">
        <input type="checkbox" name="privacy_consent" required className="mt-1" />
        <span>
          Concordo com o tratamento dos meus dados de acordo com a{" "}
          <a href="/politica-de-privacidade" className="text-primary underline">Política de Privacidade</a>.
        </span>
      </label>
      {errors.privacy_consent && <p className="text-[13px] text-error -mt-3">{errors.privacy_consent}</p>}
      {generalError && <p className="text-[14px] text-error" role="alert">{generalError}</p>}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "A enviar..." : "Enviar pedido de fornecimento"}
      </Button>
    </form>
  );
}
