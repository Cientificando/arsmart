import clsx from "clsx";

type Tone = "neutral" | "success" | "warning" | "info" | "primary";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-muted border-border",
  success: "bg-[#EAF6F0] text-success border-[#CDEAD9]",
  warning: "bg-[#FBF3E1] text-warning border-[#F1E0B5]",
  info: "bg-[#E9F1FA] text-info border-[#CFE1F3]",
  primary: "bg-primary-light text-primary-dark border-[#F3CBA5]",
};

export default function Badge({ children, tone = "neutral" }: { children: string; tone?: Tone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
