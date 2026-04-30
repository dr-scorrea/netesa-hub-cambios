import { useState } from "react";
import { Bell, FileText, UserPlus, AlertCircle, CheckCircle2, CreditCard, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotifType = "lead" | "propuesta" | "factura" | "incidente" | "sistema";

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const ICONS: Record<NotifType, { icon: typeof Bell; cls: string }> = {
  lead: { icon: UserPlus, cls: "bg-info/15 text-info" },
  propuesta: { icon: FileText, cls: "bg-primary/15 text-primary" },
  factura: { icon: CreditCard, cls: "bg-success/15 text-success" },
  incidente: { icon: AlertCircle, cls: "bg-destructive/15 text-destructive" },
  sistema: { icon: CheckCircle2, cls: "bg-warning/15 text-warning" },
};

const SEED: Notification[] = [
  {
    id: "n1",
    type: "propuesta",
    title: "Propuesta aceptada",
    description: "Valentina Ríos (Fintech Caleta) aceptó la propuesta PR-2002.",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "n2",
    type: "lead",
    title: "Nuevo lead asignado",
    description: "Jorge Salinas (Retail Express) fue asignado a tu pipeline.",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "n3",
    type: "factura",
    title: "Factura pagada",
    description: "Factura F-1043 de Logística Andina marcada como pagada.",
    time: "Hace 3 h",
    read: false,
  },
  {
    id: "n4",
    type: "incidente",
    title: "Propuesta por vencer",
    description: "PR-2001 vence en 2 días sin respuesta del cliente.",
    time: "Ayer",
    read: true,
  },
  {
    id: "n5",
    type: "sistema",
    title: "Nuevo usuario creado",
    description: "Andrés Vega fue agregado al equipo Comercial.",
    time: "Hace 2 días",
    read: true,
  },
];

export function NotificationsPopover() {
  const [items, setItems] = useState<Notification[]>(SEED);
  const unread = items.filter((i) => !i.read).length;

  const markAll = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) =>
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Notificaciones">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(380px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notificaciones</p>
            <p className="text-xs text-muted-foreground">
              {unread > 0 ? `${unread} sin leer` : "Todo al día"}
            </p>
          </div>
          {unread > 0 && (
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={markAll}>
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[60vh]">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No tienes notificaciones.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const { icon: Icon, cls } = ICONS[n.type];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => markOne(n.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-base hover:bg-accent/40",
                        !n.read && "bg-primary/[0.03]",
                      )}
                    >
                      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", cls)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium">{n.title}</p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {n.time}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>

        <div className="border-t border-border px-4 py-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Ver todas las notificaciones
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
