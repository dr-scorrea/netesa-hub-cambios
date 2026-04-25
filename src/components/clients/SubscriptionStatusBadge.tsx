import { cn } from "@/lib/utils";
import { SUB_STATUS_LABEL, type SubscriptionStatus } from "@/data/clients";

const STYLES: Record<SubscriptionStatus, string> = {
  activa: "bg-success/15 text-success border-success/30",
  trial: "bg-info/10 text-info border-info/30",
  pausada: "bg-muted text-muted-foreground border-border",
  morosa: "bg-warning/15 text-warning-foreground border-warning/30",
  cancelada: "bg-destructive/10 text-destructive border-destructive/30",
};

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {SUB_STATUS_LABEL[status]}
    </span>
  );
}
