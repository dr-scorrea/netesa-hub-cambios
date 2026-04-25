import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/data/crm";
import { STATUS_LABEL } from "@/data/crm";

const STYLES: Record<LeadStatus, string> = {
  nuevo: "bg-info/10 text-info border-info/30",
  contactado: "bg-accent text-accent-foreground border-accent",
  diagnostico: "bg-warning/15 text-warning-foreground border-warning/30",
  propuesta: "bg-primary/10 text-primary border-primary/30",
  ganado: "bg-success/15 text-success border-success/30",
  perdido: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
