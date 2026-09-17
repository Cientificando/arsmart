"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import FormField, { inputClasses } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { ApiError, submitContactMessage } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGeneralError("");

    const form = new FormData(e.currentTarget);
    try {
      await submitContactMessage({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        subject: String(form.get("subject") || ""),
        message: String(form.get("message") || ""),
        privacy_consent: form.get("privacy_consent") === "on",
      });
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
          setGeneralError("Não foi possível enviar a mensagem. Tente novamente.");
        }
      } else {
        setGeneralError("Não foi possível enviar a mensagem. Verifique a sua ligação e tente novamente.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[#CDEAD9] bg-[#EAF6F0] p-10 text-center">
        <CheckCircle2 className="mx-auto text-success" size={40} strokeWidth={1.5} />
        <h2 className="mt-4 text-[19px] font-medium text-ink">Mensagem enviada com sucesso.</h2>
        <p className="mt-2 text-[15px] text-ink-soft">Entraremos em contacto brevemente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Nome" htmlFor="name" required error={errors.name}>
        <input id="name" name="name" required className={inputClasses} />
      </FormField>
      <FormField label="Email" htmlFor="email" required error={errors.email}>
        <input id="email" name="email" type="email" required className={inputClasses} />
      </FormField>
      <FormField label="Telefone" htmlFor="phone" error={errors.phone}>
        <input id="phone" name="phone" className={inputClasses} />
      </FormField>
      <FormField label="Assunto" htmlFor="subject" required error={errors.subject}>
        <input id="subject" name="subject" required className={inputClasses} />
      </FormField>
      <FormField label="Mensagem" htmlFor="message" required error={errors.message}>
        <textarea id="message" name="message" required rows={5} className={inputClasses} />
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
        {status === "submitting" ? "A enviar..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
