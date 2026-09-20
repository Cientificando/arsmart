"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import FormField, { inputClasses } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { ApiError, submitQuoteRequest, type QuoteRequestPayload } from "@/lib/api";
import type { ProductCategory, RequestType, ServiceListItem, SoftwareListItem } from "@/types";

const typeOptions: { value: RequestType; label: string }[] = [
  { value: "SERVICE", label: "Serviço" },
  { value: "SOFTWARE", label: "Software" },
  { value: "SUPPLY", label: "Fornecimento" },
  { value: "CONSULTING", label: "Consultoria" },
  { value: "DEMO", label: "Demonstração" },
  { value: "PROPOSAL", label: "Proposta" },
  { value: "OTHER", label: "Outro" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteRequestForm({
  services,
  softwareList,
  productCategories,
}: {
  services: ServiceListItem[];
  softwareList: SoftwareListItem[];
  productCategories: ProductCategory[];
}) {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("tipo") as RequestType) || "SERVICE";

  const [requestType, setRequestType] = useState<RequestType>(initialType);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGeneralError("");

    const form = new FormData(e.currentTarget);
    const payload: QuoteRequestPayload = {
      customer_name: String(form.get("customer_name") || ""),
      company_name: String(form.get("company_name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      request_type: requestType,
      subject: String(form.get("subject") || ""),
      description: String(form.get("description") || ""),
      quantity: String(form.get("quantity") || ""),
      budget: String(form.get("budget") || ""),
      location: String(form.get("location") || ""),
      deadline: String(form.get("deadline") || ""),
      privacy_consent: form.get("privacy_consent") === "on",
    };

    if (requestType === "SERVICE" && form.get("service")) payload.service = Number(form.get("service"));
    if ((requestType === "SOFTWARE" || requestType === "DEMO") && form.get("software")) {
      payload.software = Number(form.get("software"));
    }
    if (requestType === "SUPPLY" && form.get("product_category")) {
      payload.product_category = Number(form.get("product_category"));
    }

    try {
      const result = await submitQuoteRequest(payload, attachment);
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
      <div className="rounded-[var(--radius-lg)] border border-[#CDEAD9] bg-[#EAF6F0] p-10 text-center max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto text-success" size={40} strokeWidth={1.5} />
        <h2 className="mt-4 text-[19px] font-medium text-ink">Pedido recebido com sucesso.</h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          A sua referência é <span className="font-medium text-ink">{reference}</span>. Entraremos em
          contacto brevemente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div>
        <p className="text-[14px] font-medium text-ink mb-3">Tipo de pedido</p>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setRequestType(opt.value)}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
                requestType === opt.value
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border text-ink-soft hover:border-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <FormField label="Nome" htmlFor="customer_name" required error={errors.customer_name}>
          <input id="customer_name" name="customer_name" required className={inputClasses} />
        </FormField>
        <FormField label="Empresa" htmlFor="company_name" error={errors.company_name}>
          <input id="company_name" name="company_name" className={inputClasses} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email}>
          <input id="email" name="email" type="email" required className={inputClasses} />
        </FormField>
        <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" className={inputClasses} />
        </FormField>
        <FormField label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp}>
          <input id="whatsapp" name="whatsapp" className={inputClasses} />
        </FormField>
        <FormField label="Localização" htmlFor="location" error={errors.location}>
          <input id="location" name="location" className={inputClasses} />
        </FormField>
      </div>

      {requestType === "SERVICE" && (
        <FormField label="Serviço pretendido" htmlFor="service" required error={errors.service}>
          <select id="service" name="service" required className={inputClasses} defaultValue={searchParams.get("servico") || ""}>
            <option value="" disabled>Seleccione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
      )}

      {(requestType === "SOFTWARE" || requestType === "DEMO") && (
        <FormField label="Solução de software" htmlFor="software" required error={errors.software}>
          <select id="software" name="software" required className={inputClasses} defaultValue={searchParams.get("software") || ""}>
            <option value="" disabled>Seleccione uma solução</option>
            {softwareList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
      )}

      {requestType === "SUPPLY" && (
        <FormField label="Categoria do produto" htmlFor="product_category" error={errors.product_category}>
          <select id="product_category" name="product_category" className={inputClasses}>
            <option value="">Seleccione uma categoria (opcional)</option>
            {productCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>
      )}

      <FormField label="Assunto" htmlFor="subject" required error={errors.subject}>
        <input id="subject" name="subject" required className={inputClasses} placeholder="Resumo do pedido em poucas palavras" />
      </FormField>

      <FormField label="Descrição da necessidade" htmlFor="description" required error={errors.description}>
        <textarea id="description" name="description" required rows={5} className={inputClasses} />
      </FormField>

      <div className="grid sm:grid-cols-3 gap-5">
        <FormField label="Quantidade" htmlFor="quantity" error={errors.quantity}>
          <input id="quantity" name="quantity" className={inputClasses} />
        </FormField>
        <FormField label="Orçamento estimado" htmlFor="budget" error={errors.budget}>
          <input id="budget" name="budget" className={inputClasses} />
        </FormField>
        <FormField label="Prazo" htmlFor="deadline" error={errors.deadline}>
          <input id="deadline" name="deadline" className={inputClasses} />
        </FormField>
      </div>

      <FormField
        label="Anexo (opcional)"
        htmlFor="attachment"
        hint="PDF, Word, imagens — máx. 10 MB"
        error={errors.attachment}
      >
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className={inputClasses + " file:mr-3 file:py-1 file:px-3 file:rounded-full file:border file:border-border file:text-[13px] file:bg-surface file:text-ink-soft hover:file:bg-ink hover:file:text-white file:transition-colors cursor-pointer"}
          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
        />
        {attachment && (
          <p className="mt-1.5 text-[13px] text-primary">
            {attachment.name} ({(attachment.size / 1024).toFixed(0)} KB)
          </p>
        )}
      </FormField>

      <label className="flex items-start gap-3 text-[14px] text-ink-soft">
        <input type="checkbox" name="privacy_consent" required className="mt-1" />
        <span>
          Concordo com o tratamento dos meus dados de acordo com a{" "}
          <a href="/politica-de-privacidade" className="text-primary underline">Política de Privacidade</a>.
        </span>
      </label>
      {errors.privacy_consent && <p className="text-[13px] text-error -mt-4">{errors.privacy_consent}</p>}

      {generalError && <p className="text-[14px] text-error" role="alert">{generalError}</p>}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "A enviar..." : "Enviar pedido"}
      </Button>
    </form>
  );
}
