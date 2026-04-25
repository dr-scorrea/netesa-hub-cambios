import { cn } from "@/lib/utils";
import { FACTURA_ESTADO_LABEL, type FacturaEstado } from "@/data/finanzas";
import { Loader2 } from "lucide-react";

const STYLES: Record<FacturaEstado, string> = {
  extraccion: "bg-primary/10 text-primary border-primary/30",
  revision: "bg-warning/15 text-warning-foreground border-warning/30",
  pendiente: "bg-info/10 text-info border-info/30",
  aprobada: "bg-success/15 text-success border-success/30",
  pagada: "bg-success/20 text-success border-success/40",
  rechazada: "bg-destructive/10 text-destructive border-destructive/30",
};

export function FacturaStatusBadge({ estado }: { estado: FacturaEstado }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        STYLES[estado],
      )}
    >
      {estado === "extraccion" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {FACTURA_ESTADO_LABEL[estado]}
    </span>
  );
}
