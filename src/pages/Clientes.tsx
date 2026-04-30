import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Search,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Settings,
} from "lucide-react";
import { AppBadge } from "@/components/shared/AppBadge";
import { useClients } from "@/context/ClientsContext";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientDetailDialog } from "@/components/clients/ClientDetailDialog";
import { COUNTRY_LABEL, type Client } from "@/data/clients";
import { formatCurrency } from "@/data/crm";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

export default function Clientes() {
  const navigate = useNavigate();
  const { clients, subscriptions, addClient } = useClients();
  const { activeApp } = useAppContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Client["status"] | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);

  const subsByClient = useMemo(() => {
    const m: Record<string, typeof subscriptions> = {};
    subscriptions.forEach((s) => {
      (m[s.clientId] ||= []).push(s);
    });
    return m;
  }, [subscriptions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (activeApp !== "all") {
        const has = (subsByClient[c.id] ?? []).some((s) => s.appId === activeApp);
        if (!has) return false;
      }
      if (!q) return true;
      return (
        c.legalName.toLowerCase().includes(q) ||
        c.tradeName.toLowerCase().includes(q) ||
        c.taxId.toLowerCase().includes(q) ||
        c.contactEmail.toLowerCase().includes(q)
      );
    });
  }, [clients, search, statusFilter, activeApp, subsByClient]);

  const stats = useMemo(() => {
    const activos = clients.filter((c) => c.status === "activo").length;
    const trials = clients.filter((c) => c.status === "trial").length;
    const totalSubs = subscriptions.filter((s) => s.status === "activa").length;
    const morosas = subscriptions.filter((s) => s.status === "morosa").length;
    let mrrPEN = 0;
    subscriptions
      .filter((s) => (s.status === "activa" || s.status === "trial") && s.currency === "PEN")
      .forEach((s) => {
        mrrPEN += s.billingCycle === "anual" ? s.negotiatedPrice / 12 : s.negotiatedPrice;
      });
    return { activos, trials, totalSubs, morosas, mrrPEN };
  }, [clients, subscriptions]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Empresas que han contratado una o más Apps del ecosistema. Cada cliente tiene sus planes, precios negociados y ciclos propios."
        icon={<Building2 className="h-5 w-5" />}
        actions={
          <Button onClick={() => setShowCreate(true)} className="shadow-glow">
            <Plus className="h-4 w-4" />
            Nuevo cliente
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-4 w-4" />}
          label="Clientes activos"
          value={stats.activos.toString()}
          hint={`${stats.trials} en trial`}
          tone="primary"
        />
        <StatCard
          icon={<Package className="h-4 w-4" />}
          label="Suscripciones activas"
          value={stats.totalSubs.toString()}
          hint={`${subscriptions.length} totales`}
          tone="info"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="MRR estimado (PEN)"
          value={formatCurrency(stats.mrrPEN, "PEN")}
          hint="Recurrente mensualizado"
          tone="success"
        />
        <StatCard
          icon={<AlertCircle className="h-4 w-4" />}
          label="Suscripciones morosas"
          value={stats.morosas.toString()}
          hint="Requieren cobro"
          tone="warning"
        />
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por razón social, RUC, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Client["status"] | "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="trial">En trial</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No hay clientes que coincidan con los filtros.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((c) => {
                const subs = subsByClient[c.id] ?? [];
                const activeSubs = subs.filter((s) => s.status === "activa" || s.status === "trial");
                const totalSeats = activeSubs.reduce((s, x) => s + x.seatsAssigned, 0);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="group flex w-full items-center gap-4 px-4 py-3 text-left transition-base hover:bg-accent/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                      {c.tradeName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold">{c.tradeName}</span>
                        <ClientStatusBadge status={c.status} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.legalName} · {COUNTRY_LABEL[c.country]} · {c.industry}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {activeSubs.length === 0 ? (
                          <span className="text-xs italic text-muted-foreground">Sin suscripciones</span>
                        ) : (
                          activeSubs.map((s) => <AppBadge key={s.id} appId={s.appId} size="sm" />)
                        )}
                      </div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium">
                        <Users className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                        {totalSeats} usuarios
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activeSubs.length} {activeSubs.length === 1 ? "App" : "Apps"}
                      </p>
                    </div>
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clientes/${c.id}/configuracion`);
                      }}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-base hover:border-primary/40 hover:text-primary"
                    >
                      <Settings className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Configurar</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-base group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border p-6">
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>
              Después de crearlo podrás asignarle suscripciones a las Apps del ecosistema.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <ClientForm
              onSubmit={(c) => {
                const id = `CLT-${String(Date.now()).slice(-4)}`;
                addClient({ ...(c as Client), id, createdAt: new Date().toISOString() });
                toast({ title: "Cliente creado", description: c.legalName });
                setShowCreate(false);
              }}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ClientDetailDialog
        client={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  );
}

function ClientStatusBadge({ status }: { status: Client["status"] }) {
  const styles = {
    activo: "bg-success/15 text-success border-success/30",
    trial: "bg-info/10 text-info border-info/30",
    inactivo: "bg-muted text-muted-foreground border-border",
  };
  const label = { activo: "Activo", trial: "Trial", inactivo: "Inactivo" };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label[status]}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "warning" | "info" | "success";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    info: "bg-info/10 text-info",
    success: "bg-success/15 text-success",
  }[tone];
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
