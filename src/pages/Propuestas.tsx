import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Calendar, Send, Pencil, Trash2 } from "lucide-react";
import { LEADS, PLANS, formatCurrency, type Proposal } from "@/data/crm";
import { useAppContext } from "@/context/AppContext";
import { useProposals } from "@/context/ProposalsContext";
import { AppBadge } from "@/components/shared/AppBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProposalForm } from "@/components/crm/ProposalForm";
import { ProposalDetailDialog } from "@/components/crm/ProposalDetailDialog";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { toast } from "sonner";

const STATUS_STYLE = {
  borrador: "bg-muted text-muted-foreground",
  enviada: "bg-info/15 text-info",
  aceptada: "bg-success/15 text-success",
  rechazada: "bg-destructive/15 text-destructive",
} as const;

const Propuestas = () => {
  const { activeApp } = useAppContext();
  const { proposals, addProposal, updateProposal, removeProposal } = useProposals();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [detail, setDetail] = useState<Proposal | null>(null);
  const [toDelete, setToDelete] = useState<Proposal | null>(null);

  const filtered = useMemo(
    () => (activeApp === "all" ? proposals : proposals.filter((p) => p.appId === activeApp)),
    [proposals, activeApp],
  );

  const handleCreate = (data: Omit<Proposal, "id" | "createdAt">) => {
    const newProposal: Proposal = {
      ...data,
      id: `PR-${2000 + proposals.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    addProposal(newProposal);
    setCreateOpen(false);
    toast.success("Propuesta creada", { description: newProposal.id });
  };

  const handleUpdate = (data: Omit<Proposal, "id" | "createdAt">) => {
    if (!editing) return;
    updateProposal(editing.id, data);
    toast.success("Propuesta actualizada", { description: editing.id });
    setEditing(null);
    // Si estaba abierta en detalle, refrescar la referencia
    setDetail((d) => (d && d.id === editing.id ? { ...d, ...data } : d));
  };

  const handleDelete = () => {
    if (!toDelete) return;
    removeProposal(toDelete.id);
    toast.success("Propuesta eliminada", { description: toDelete.id });
    setDetail((d) => (d && d.id === toDelete.id ? null : d));
    setToDelete(null);
  };

  const handleStatus = (p: Proposal, status: Proposal["status"]) => {
    updateProposal(p.id, { status });
    setDetail((d) => (d && d.id === p.id ? { ...d, status } : d));
    toast.success("Estado actualizado", { description: `${p.id} → ${status}` });
  };

  return (
    <>
      <PageHeader
        title="Propuestas comerciales"
        description="Cada propuesta se basa en los planes configurados de la App de interés del lead."
        icon={<FileText className="h-5 w-5" />}
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Nueva propuesta
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((pr) => {
          const lead = LEADS.find((l) => l.id === pr.leadId);
          const plan = PLANS.find((p) => p.id === pr.planId);
          const valid = new Date(pr.validUntil);
          return (
            <Card key={pr.id} className="border-border bg-card shadow-card transition-base hover:shadow-elevated">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-muted-foreground">{pr.id}</div>
                    <div className="mt-0.5 truncate text-base font-semibold">{lead?.fullName ?? "—"}</div>
                    <div className="truncate text-xs text-muted-foreground">{lead?.company}</div>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", STATUS_STYLE[pr.status])}>
                    {pr.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <AppBadge appId={pr.appId} size="xs" />
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="truncate text-xs font-medium">{plan?.name}</span>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-accent/30 p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Monto negociado</div>
                  <div className="mt-0.5 text-2xl font-bold tracking-tight">{formatCurrency(pr.amount, pr.currency)}</div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Válida hasta {valid.toLocaleDateString("es-PE")}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex-1 min-w-[100px]" onClick={() => setDetail(pr)}>
                    Ver detalle
                  </Button>
                  {pr.status === "borrador" && (
                    <Button
                      size="sm"
                      className="flex-1 min-w-[100px] bg-gradient-primary text-primary-foreground hover:opacity-90"
                      onClick={() => handleStatus(pr, "enviada")}
                    >
                      <Send className="mr-1 h-3.5 w-3.5" /> Enviar
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => setEditing(pr)} aria-label="Editar">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => setToDelete(pr)}
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="col-span-full border-dashed border-border bg-card/50">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No hay propuestas para los filtros actuales.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Crear */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 p-0 sm:max-w-xl">
          <DialogHeader className="shrink-0 border-b border-border p-6">
            <DialogTitle>Nueva propuesta</DialogTitle>
            <DialogDescription>Selecciona el lead y el plan a proponer.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <ProposalForm onSubmit={handleCreate} submitLabel="Crear propuesta" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 p-0 sm:max-w-xl">
          <DialogHeader className="shrink-0 border-b border-border p-6">
            <DialogTitle>Editar propuesta</DialogTitle>
            <DialogDescription>{editing?.id}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {editing && (
              <ProposalForm initial={editing} onSubmit={handleUpdate} submitLabel="Guardar cambios" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detalle */}
      <ProposalDetailDialog
        proposal={detail}
        open={!!detail}
        onOpenChange={(v) => !v && setDetail(null)}
        onEdit={() => {
          if (detail) {
            setEditing(detail);
          }
        }}
        onDelete={() => {
          if (detail) setToDelete(detail);
        }}
        onChangeStatus={(s) => detail && handleStatus(detail, s)}
      />

      {/* Confirmar eliminación */}
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar propuesta"
        description={
          toDelete
            ? `¿Seguro que deseas eliminar la propuesta ${toDelete.id}? Esta acción no se puede deshacer.`
            : ""
        }
      />
    </>
  );
};

export default Propuestas;
