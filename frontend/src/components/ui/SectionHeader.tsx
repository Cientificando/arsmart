export default function SectionHeader({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <h2 className="text-3xl md:text-[2.25rem] font-medium leading-tight text-ink">{title}</h2>
      {description && <p className="mt-3 text-[17px] leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
