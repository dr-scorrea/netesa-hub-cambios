import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, UserPlus, AlertCircle, CheckCircle2, CreditCard, CheckCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { useNotifications } from "@/context/NotificationsContext";
import type { NotifType } from "@/data/notifications";

const ICONS: Record<NotifType, { icon: typeof Bell; cls: string; label: string }> = {
  lead: { icon: UserPlus, cls: "bg-info/15 text-info", label: "Lead" },
  propuesta: { icon: FileText, cls: "bg-primary/15 text-primary", label: "Propuesta" },
  factura: { icon: CreditCard, cls: "bg-success/15 text-success", label: "Factura" },
  incidente: { icon: AlertCircle, cls: "bg-destructive/15 text-destructive", label: "Incidente" },
  sistema: { icon: CheckCircle2, cls: "bg-warning/15 text-warning", label: "Sistema" },
};

type Filter = "all" | "unread" | NotifType;

export default function Notificaciones() {
  const { items, unread, markOne, markAll } = useNotifications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        description="Centro de actividad: leads, propuestas, facturas, incidentes y sistema."
        icon={<Bell className="h-4 w-4" />}
        actions={
          unread > 0 ? (
            <Button variant="outline" size="sm" onClick={markAll}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          ) : null
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mb-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todas <Badge variant="secondary" className="ml-2">{items.length}</Badge></TabsTrigger>
          <TabsTrigger value="unread">No leídas <Badge variant="secondary" className="ml-2">{unread}</Badge></TabsTrigger>
          <TabsTrigger value="lead">Leads</TabsTrigger>
          <TabsTrigger value="propuesta">Propuestas</TabsTrigger>
          <TabsTrigger value="factura">Facturas</TabsTrigger>
          <TabsTrigger value="incidente">Incidentes</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-muted-foreground">
            No hay notificaciones en esta vista.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const { icon: Icon, cls, label } = ICONS[n.type];
              const clickable = Boolean(n.to);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markOne(n.id);
                      if (n.to) navigate(n.to);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-4 text-left transition-base hover:bg-accent/40 md:px-6",
                      !n.read && "bg-primary/[0.03]",
                    )}
                  >
                    <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", cls)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{n.title}</p>
                        <Badge variant="outline" className="text-[10px]">{label}</Badge>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary" aria-label="No leída" />}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{n.time}</p>
                    </div>
                    {clickable && (
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
