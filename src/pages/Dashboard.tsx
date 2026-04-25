import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
import { LEADS, PROPOSALS, PLANS, formatCurrency } from "@/data/crm";
import { APPS } from "@/data/apps";
import { useAppContext } from "@/context/AppContext";
import { AppBadge } from "@/components/shared/AppBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { activeApp } = useAppContext();

  const leads = activeApp === "all" ? LEADS : LEADS.filter((l) => l.appId === activeApp);
  const proposals = activeApp === "all" ? PROPOSALS : PROPOSALS.filter((p) => p.appId === activeApp);

  const totalPipeline = leads
    .filter((l) => !["ganado", "perdido"].includes(l.status))
    .reduce((acc, l) => acc + (l.currency === "USD" ? l.estimatedValue * 3.7 : l.currency === "CLP" ? l.estimatedValue / 260 : l.estimatedValue), 0);
  const wonCount = leads.filter((l) => l.status === "ganado").length;
  const conversionRate = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

  const kpis = [
    {
      label: "Leads activos",
      value: leads.filter((l) => !["ganado", "perdido"].includes(l.status)).length,
      delta: "+12%",
      positive: true,
      icon: Users,
    },
    {
      label: "Pipeline (PEN)",
      value: formatCurrency(totalPipeline, "PEN"),
      delta: "+8.4%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Propuestas",
      value: proposals.length,
      delta: `${proposals.filter((p) => p.status === "enviada").length} enviadas`,
      positive: true,
      icon: FileText,
    },
    {
      label: "Conversión",
      value: `${conversionRate}%`,
      delta: "-2.1%",
      positive: false,
      icon: Target,
    },
  ];

  const byApp = APPS.filter((a) => a.category === "saas").map((app) => {
    const appLeads = LEADS.filter((l) => l.appId === app.id);
    const appPlans = PLANS.filter((p) => p.appId === app.id);
    return {
      app,
      leadCount: appLeads.length,
      activePlans: appPlans.length,
      won: appLeads.filter((l) => l.status === "ganado").length,
    };
  });

  const recent = [...leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard del ecosistema"
        description="Visión consolidada del CRM Multi-SaaS de Netesa. Cambia el contexto desde el switch superior para enfocar una App."
        icon={<Sparkles className="h-5 w-5" />}
        actions={
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <NavLink to="/leads">Ver todos los leads</NavLink>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border bg-card shadow-card transition-base hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <k.icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight">{k.value}</div>
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-xs font-medium",
                  k.positive ? "text-success" : "text-destructive",
                )}
              >
                {k.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card shadow-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Rendimiento por aplicación</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/apps">Gestionar apps</NavLink>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {byApp.map(({ app, leadCount, activePlans, won }) => {
                const max = Math.max(...byApp.map((b) => b.leadCount), 1);
                const pct = (leadCount / max) * 100;
                const Icon = app.icon;
                return (
                  <div key={app.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-primary-foreground", app.bgVar)}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium">{app.name}</span>
                        {!app.active && (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Próximamente</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{activePlans} planes</span>
                        <span>{won} cerrados</span>
                        <span className="font-semibold text-foreground">{leadCount} leads</span>
                      </div>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Leads recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background/50 p-3 transition-base hover:bg-accent/30">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{l.fullName}</div>
                  <div className="truncate text-xs text-muted-foreground">{l.company}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <AppBadge appId={l.appId} size="xs" />
                    <StatusBadge status={l.status} />
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">{formatCurrency(l.estimatedValue, l.currency)}</div>
                  <div className="text-muted-foreground">{l.owner.split(" ")[0]}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
