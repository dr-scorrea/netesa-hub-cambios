import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes, Users, Package, ArrowRight } from "lucide-react";
import { APPS } from "@/data/apps";
import { LEADS, PLANS } from "@/data/crm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { NavLink } from "@/components/NavLink";

const Apps = () => {
  const { setActiveApp } = useAppContext();
  return (
    <>
      <PageHeader
        title="Aplicaciones del ecosistema"
        description="Cada App SaaS opera de forma aislada (Multi-Tenancy). Aquí defines su disponibilidad comercial."
        icon={<Boxes className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {APPS.map((app) => {
          const Icon = app.icon;
          const leadCount = LEADS.filter((l) => l.appId === app.id).length;
          const planCount = PLANS.filter((p) => p.appId === app.id).length;
          return (
            <Card key={app.id} className="group relative overflow-hidden border-border bg-card shadow-card transition-base hover:-translate-y-0.5 hover:shadow-elevated">
              <div className={cn("absolute inset-x-0 top-0 h-1", app.bgVar)} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-md", app.bgVar)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      app.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {app.active ? "Activa" : "Próximamente"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{app.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{app.description}</p>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <span>
                      <strong className="text-foreground">{planCount}</strong> planes
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      <strong className="text-foreground">{leadCount}</strong> leads
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setActiveApp(app.id)}
                    asChild
                  >
                    <NavLink to="/leads">
                      Ver CRM
                    </NavLink>
                  </Button>
                  <Button size="sm" className="flex-1 bg-foreground text-background hover:bg-foreground/90" asChild>
                    <NavLink to="/planes">
                      Planes <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </NavLink>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Apps;
