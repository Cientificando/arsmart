import { type ReactNode } from "react";
import clsx from "clsx";

export default function Card({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  return (
    <Component
      className={clsx(
        "rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      {children}
    </Component>
  );
}
