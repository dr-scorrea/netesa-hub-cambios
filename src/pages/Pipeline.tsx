import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LEADS, formatCurrency, STATUS_LABEL, type LeadStatus } from "@/data/crm";
import { useAppContext } from "@/context/AppContext";
import { AppBadge } from "@/components/shared/AppBadge";
import { cn } from "@/lib/utils";

const STAGES: LeadStatus[] = ["nuevo", "contactado", "diagnostico", "propuesta", "ganado"];

const STAGE_COLORS: Record<LeadStatus, string> = {
  nuevo: "border-t-info",
  contactado: "border-t-accent-foreground",
  diagnostico: "border-t-warning",
  propuesta: "border-t-primary",
  ganado: "border-t-success",
  perdido: "border-t-destructive",
};

const Pipeline = () => {
  const { activeApp } = useAppContext();
  const leads = activeApp === "all" ? LEADS : LEADS.filter((l) => l.appId === activeApp);

  return (
    <>
      <PageHeader
        title="Pipeline comercial"
        description="Vista Kanban del flujo de venta segmentada por App del ecosistema."
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage);
          const total = stageLeads.reduce(
            (acc, l) => acc + (l.currency === "USD" ? l.estimatedValue * 3.7 : l.currency === "CLP" ? l.estimatedValue / 260 : l.estimatedValue),
            0,
          );
          return (
            <div key={stage} className={cn("rounded-xl border border-border border-t-4 bg-card/60 p-3", STAGE_COLORS[stage])}>
              <div className="flex items-center justify-between px-1 pb-2">
                <h3 className="text-sm font-semibold">{STATUS_LABEL[stage]}</h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold">{stageLeads.length}</span>
              </div>
              <div className="px-1 pb-2 text-xs text-muted-foreground">{formatCurrency(total, "PEN")}</div>
              <div className="space-y-2">
                {stageLeads.map((l) => (
                  <Card key={l.id} className="cursor-grab border-border bg-card p-3 shadow-sm transition-base hover:shadow-card active:cursor-grabbing">
                    <div className="text-sm font-semibold leading-tight">{l.fullName}</div>
                    <div className="truncate text-xs text-muted-foreground">{l.company}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <AppBadge appId={l.appId} size="xs" />
                      <span className="text-xs font-semibold tabular-nums">{formatCurrency(l.estimatedValue, l.currency)}</span>
                    </div>
                  </Card>
                ))}
                {stageLeads.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    Sin leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pipeline;
