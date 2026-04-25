import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Check, Star, Users, HardDrive, Building2, TrendingUp } from "lucide-react";
import { PLANS, formatCurrency, type Currency } from "@/data/crm";
import { APPS } from "@/data/apps";
import { useAppContext } from "@/context/AppContext";
import { useClients } from "@/context/ClientsContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AppBadge } from "@/components/shared/AppBadge";
import { Link } from "react-router-dom";

const Planes = () => {
  const { activeApp, setActiveApp } = useAppContext();
  const { clients, subscriptions } = useClients();
  const [currency, setCurrency] = useState<Currency>("PEN");

  const plans = activeApp === "all" ? PLANS : PLANS.filter((p) => p.appId === activeApp);

  // Adoption metrics by plan
  const adoption = useMemo(() => {
    const m: Record<string, { count: number; mrr: Record<Currency, number> }> = {};
    PLANS.forEach((p) => {
      m[p.id] = { count: 0, mrr: { PEN: 0, USD: 0, CLP: 0 } };
    });
    subscriptions.forEach((s) => {
      if (!m[s.planId]) return;
      if (s.status !== "activa" && s.status !== "trial") return;
      m[s.planId].count += 1;
      const monthly = s.billingCycle === "anual" ? s.negotiatedPrice / 12 : s.negotiatedPrice;
      m[s.planId].mrr[s.currency] += monthly;
    });
    return m;
  }, [subscriptions]);

  const totalContratos = subscriptions.filter((s) => s.status === "activa" || s.status === "trial").length;

  // group by app
  const grouped = plans.reduce<Record<string, typeof plans>>((acc, p) => {
    (acc[p.appId] ||= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Planes y precios (catálogo)"
        description="Catálogo base de planes por App. Cada cliente firma con un precio negociado y ciclo propio en su ficha de cliente."
        icon={<Package className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Select value={activeApp} onValueChange={(v) => setActiveApp(v as any)}>
              <SelectTrigger className="h-10 w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Apps</SelectItem>
                {APPS.filter((a) => a.category === "saas").map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <TabsList className="h-10">
                <TabsTrigger value="PEN">PEN</TabsTrigger>
                <TabsTrigger value="USD">USD</TabsTrigger>
                <TabsTrigger value="CLP">CLP</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      <Card className="mb-6 bg-gradient-mesh">
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Catálogo</p>
            <p className="text-xl font-bold">{PLANS.length} planes</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contratos vivos</p>
            <p className="text-xl font-bold">{totalContratos}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Clientes con suscripción</p>
            <p className="text-xl font-bold">
              {new Set(subscriptions.filter((s) => s.status !== "cancelada").map((s) => s.clientId)).size} / {clients.length}
            </p>
          </div>
          <div className="ml-auto">
            <Button asChild variant="outline" size="sm">
              <Link to="/clientes">
                <Building2 className="h-4 w-4" />
                Ir a Clientes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {Object.entries(grouped).map(([appId, appPlans]) => {
          const app = APPS.find((a) => a.id === appId)!;
          return (
            <section key={appId}>
              <div className="mb-3 flex items-center gap-2">
                <AppBadge appId={app.id} size="md" />
                <span className="text-xs text-muted-foreground">{appPlans.length} planes</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appPlans.map((p) => {
                  const stats = adoption[p.id];
                  return (
                    <Card
                      key={p.id}
                      className={cn(
                        "relative flex flex-col overflow-hidden border-border bg-card shadow-card transition-base hover:-translate-y-0.5 hover:shadow-elevated",
                        p.highlight && "border-primary/40 ring-1 ring-primary/30",
                      )}
                    >
                      {p.highlight && (
                        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground shadow-glow">
                          <Star className="h-3 w-3" /> Más vendido
                        </div>
                      )}
                      <CardContent className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-bold tracking-tight">
                            {formatCurrency(p.prices[currency], currency)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{p.billing === "mensual" ? "mes" : "año"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Precio de lista · negociable por cliente
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-border bg-accent/30 p-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span><strong className="text-foreground">{p.maxUsers}</strong> usuarios</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                            <span><strong className="text-foreground">{p.storageGB} GB</strong></span>
                          </div>
                        </div>

                        <ul className="mt-4 space-y-1.5">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            <strong className="text-foreground">{stats.count}</strong>
                            {stats.count === 1 ? "cliente" : "clientes"}
                          </span>
                          {stats.mrr[currency] > 0 && (
                            <span className="flex items-center gap-1 font-medium text-success">
                              <TrendingUp className="h-3.5 w-3.5" />
                              {formatCurrency(stats.mrr[currency], currency)}/mes
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
        {Object.keys(grouped).length === 0 && (
          <Card className="border-dashed border-border bg-card/50">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No hay planes configurados para esta App todavía.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Planes;
