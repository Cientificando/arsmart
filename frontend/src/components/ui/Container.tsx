import { type ReactNode } from "react";
import clsx from "clsx";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-6 md:px-8", className)}>{children}</div>;
}
