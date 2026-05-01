import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, BookOpen, MessageCircle, Keyboard, LifeBuoy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LINKS = [
  {
    icon: BookOpen,
    title: "Centro de ayuda",
    description: "Guías y documentación del ERP.",
    to: "/ayuda/centro",
  },
  {
    icon: Sparkles,
    title: "Novedades",
    description: "Últimas mejoras y cambios.",
    to: "/ayuda/novedades",
  },
  {
    icon: Keyboard,
    title: "Atajos de teclado",
    description: "Acelera tu trabajo diario.",
    to: "/ayuda/atajos",
  },
  {
    icon: MessageCircle,
    title: "Contactar soporte",
    description: "Habla con el equipo de Netesa.",
    to: "/ayuda/soporte",
  },
];

export function HelpPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Ayuda">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(340px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
            <LifeBuoy className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">¿Necesitas ayuda?</p>
            <p className="text-xs text-muted-foreground">Recursos y soporte de Netesa.</p>
          </div>
        </div>

        <ul className="p-2">
          {LINKS.map(({ icon: Icon, title, description, to }) => (
            <li key={to}>
              <button
                type="button"
                onClick={() => go(to)}
                className="group flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-base hover:bg-accent/50"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/50 text-foreground/80 group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <span className="text-[11px] text-muted-foreground">ERP Netesa · v1.0.0</span>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => go("/ayuda")}>
            Ver todo
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
