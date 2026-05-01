import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, UserPlus, AlertCircle, CheckCircle2, CreditCard, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationsContext";
import type { NotifType, Notification } from "@/data/notifications";

const ICONS: Record<NotifType, { icon: typeof Bell; cls: string }> = {
  lead: { icon: UserPlus, cls: "bg-info/15 text-info" },
  propuesta: { icon: FileText, cls: "bg-primary/15 text-primary" },
  factura: { icon: CreditCard, cls: "bg-success/15 text-success" },
  incidente: { icon: AlertCircle, cls: "bg-destructive/15 text-destructive" },
  sistema: { icon: CheckCircle2, cls: "bg-warning/15 text-warning" },
};

export function NotificationsPopover() {
  const { items, unread, markOne, markAll } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClick = (n: Notification) => {
    markOne(n.id);
    if (n.to) {
      setOpen(false);
      navigate(n.to);
    }
  };

  const handleSeeAll = () => {
    setOpen(false);
    navigate("/notificaciones");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                      onClick={() => handleClick(n)}
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
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleSeeAll}>
            Ver todas las notificaciones
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
