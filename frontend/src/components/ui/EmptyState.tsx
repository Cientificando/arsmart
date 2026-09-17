import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface px-8 py-16 text-center">
      <Inbox className="h-8 w-8 text-muted" strokeWidth={1.5} />
      <p className="text-[15px] text-muted">{message}</p>
      {action}
    </div>
  );
}
