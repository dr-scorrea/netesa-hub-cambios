import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Calendar, Send } from "lucide-react";
import { PROPOSALS, LEADS, PLANS, formatCurrency } from "@/data/crm";
import { useAppContext } from "@/context/AppContext";
import { AppBadge } from "@/components/shared/AppBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  borrador: "bg-muted text-muted-foreground",
  enviada: "bg-info/15 text-info",
  aceptada: "bg-success/15 text-success",
  rechazada: "bg-destructive/15 text-destructive",
} as const;

const Propuestas = () => {
  const { activeApp } = useAppContext();
  const proposals = activeApp === "all" ? PROPOSALS : PROPOSALS.filter((p) => p.appId === activeApp);

  return (
    <>
      <PageHeader
        title="Propuestas comerciales"
        description="Cada propuesta se basa en los planes configurados de la App de interés del lead."
        icon={<FileText className="h-5 w-5" />}
        actions={
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Plus className="mr-1.5 h-4 w-4" /> Nueva propuesta
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {proposals.map((pr) => {
          const lead = LEADS.find((l) => l.id === pr.leadId);
          const plan = PLANS.find((p) => p.id === pr.planId);
          const valid = new Date(pr.validUntil);
          return (
            <Card key={pr.id} className="border-border bg-card shadow-card transition-base hover:shadow-elevated">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{pr.id}</div>
                    <div className="mt-0.5 text-base font-semibold">{lead?.fullName ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{lead?.company}</div>
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", STATUS_STYLE[pr.status])}>
                    {pr.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <AppBadge appId={pr.appId} size="xs" />
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs font-medium">{plan?.name}</span>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-accent/30 p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Monto negociado</div>
                  <div className="mt-0.5 text-2xl font-bold tracking-tight">{formatCurrency(pr.amount, pr.currency)}</div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Válida hasta {valid.toLocaleDateString("es-PE")}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Ver detalle</Button>
                  {pr.status === "borrador" && (
                    <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90">
                      <Send className="mr-1 h-3.5 w-3.5" /> Enviar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {proposals.length === 0 && (
          <Card className="col-span-full border-dashed border-border bg-card/50">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No hay propuestas para los filtros actuales.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Propuestas;
