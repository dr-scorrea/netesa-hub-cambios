import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, Building2, User, Send, CheckCircle2, XCircle, Pencil, Trash2 } from "lucide-react";
import { LEADS, PLANS, formatCurrency, type Proposal } from "@/data/crm";
import { AppBadge } from "@/components/shared/AppBadge";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  borrador: "bg-muted text-muted-foreground",
  enviada: "bg-info/15 text-info",
  aceptada: "bg-success/15 text-success",
  rechazada: "bg-destructive/15 text-destructive",
} as const;

export function ProposalDetailDialog({
  proposal,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onChangeStatus,
}: {
  proposal: Proposal | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: Proposal["status"]) => void;
}) {
  if (!proposal) return null;
  const lead = LEADS.find((l) => l.id === proposal.leadId);
  const plan = PLANS.find((p) => p.id === proposal.planId);
  const valid = new Date(proposal.validUntil);
  const created = new Date(proposal.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-muted-foreground">{proposal.id}</div>
              <DialogTitle className="mt-1">Propuesta a {lead?.fullName ?? "—"}</DialogTitle>
              <DialogDescription>
                Creada el {created.toLocaleDateString("es-PE")} · Válida hasta {valid.toLocaleDateString("es-PE")}
              </DialogDescription>
            </div>
            <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", STATUS_STYLE[proposal.status])}>
              {proposal.status}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Monto destacado */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-accent/40 to-accent/10 p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Monto negociado</div>
            <div className="mt-1 text-3xl font-bold tracking-tight">
              {formatCurrency(proposal.amount, proposal.currency)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AppBadge appId={proposal.appId} size="sm" />
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-medium">{plan?.name ?? "—"}</span>
            </div>
          </div>

          {/* Datos del lead */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente / Lead
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow icon={<User className="h-4 w-4" />} label="Contacto" value={lead?.fullName ?? "—"} />
              <DetailRow icon={<Building2 className="h-4 w-4" />} label="Empresa" value={lead?.company ?? "—"} />
              <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead?.email ?? "—"} />
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={lead?.phone ?? "—"} />
            </div>
          </div>

          {/* Plan */}
          {plan && (
            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan propuesto
              </h4>
              <div className="mb-2 text-base font-semibold">{plan.name}</div>
              <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-accent/40 px-2 py-1">
                  {typeof plan.maxUsers === "number" ? `${plan.maxUsers} usuarios` : "Usuarios ilimitados"}
                </span>
                <span className="rounded-md bg-accent/40 px-2 py-1">{plan.storageGB} GB</span>
                <span className="rounded-md bg-accent/40 px-2 py-1">Facturación {plan.billing}</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fechas */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Válida hasta <strong className="text-foreground">{valid.toLocaleDateString("es-PE")}</strong>
          </div>
        </div>

        {/* Footer / acciones */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {proposal.status === "borrador" && (
                <Button size="sm" onClick={() => onChangeStatus("enviada")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <Send className="mr-1.5 h-4 w-4" /> Enviar
                </Button>
              )}
              {proposal.status === "enviada" && (
                <>
                  <Button size="sm" onClick={() => onChangeStatus("aceptada")} className="bg-success text-success-foreground hover:bg-success/90">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Marcar aceptada
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onChangeStatus("rechazada")}>
                    <XCircle className="mr-1.5 h-4 w-4" /> Rechazada
                  </Button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Pencil className="mr-1.5 h-4 w-4" /> Editar
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm">{value}</div>
      </div>
    </div>
  );
}
