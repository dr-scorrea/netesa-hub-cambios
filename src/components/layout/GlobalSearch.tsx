import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Briefcase,
  FileText,
  UserCog,
  Receipt,
  LayoutGrid,
  Package,
  FileQuestion,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClients } from "@/context/ClientsContext";
import { useUsers } from "@/context/UsersContext";
import { useProposals } from "@/context/ProposalsContext";
import { useFinanzas } from "@/context/FinanzasContext";
import { LEADS } from "@/data/crm";
import { PLANS } from "@/data/crm";
import { APPS } from "@/data/apps";
import { cn } from "@/lib/utils";

type Result = {
  id: string;
  type: "Lead" | "Cliente" | "Propuesta" | "Usuario" | "Factura" | "Plan" | "App" | "Página";
  title: string;
  subtitle?: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PAGES: Omit<Result, "icon">[] = [
  { id: "p-dash", type: "Página", title: "Dashboard", to: "/" },
  { id: "p-leads", type: "Página", title: "Leads", to: "/leads" },
  { id: "p-prop", type: "Página", title: "Propuestas", to: "/propuestas" },
  { id: "p-pipe", type: "Página", title: "Pipeline", to: "/pipeline" },
  { id: "p-cli", type: "Página", title: "Clientes", to: "/clientes" },
  { id: "p-apps", type: "Página", title: "Apps", to: "/apps" },
  { id: "p-plan", type: "Página", title: "Planes", to: "/planes" },
  { id: "p-fin", type: "Página", title: "Finanzas", to: "/finanzas" },
  { id: "p-usr", type: "Página", title: "Usuarios", to: "/usuarios" },
  { id: "p-not", type: "Página", title: "Notificaciones", to: "/notificaciones" },
  { id: "p-ayu", type: "Página", title: "Ayuda", to: "/ayuda" },
  { id: "p-cfg", type: "Página", title: "Configuración", to: "/configuracion" },
];

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { clients } = useClients();
  const { users } = useUsers();
  const { proposals } = useProposals();
  const { facturas } = useFinanzas();

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const match = (s?: string) => !!s && s.toLowerCase().includes(term);
    const out: Result[] = [];

    LEADS.forEach((l) => {
      if (match(l.fullName) || match(l.company) || match(l.email) || match(l.id)) {
        out.push({
          id: l.id,
          type: "Lead",
          title: l.fullName,
          subtitle: `${l.company} · ${l.email}`,
          to: "/leads",
          icon: Users,
        });
      }
    });

    clients.forEach((c) => {
      if (
        match(c.tradeName) ||
        match(c.legalName) ||
        match(c.taxId) ||
        match(c.contactName) ||
        match(c.contactEmail) ||
        match(c.id)
      ) {
        out.push({
          id: c.id,
          type: "Cliente",
          title: c.tradeName,
          subtitle: `${c.legalName} · ${c.taxId}`,
          to: "/clientes",
          icon: Briefcase,
        });
      }
    });

    proposals.forEach((p) => {
      if (match(p.id) || match(p.leadId) || match(p.planId)) {
        out.push({
          id: p.id,
          type: "Propuesta",
          title: p.id,
          subtitle: `${p.planId} · ${p.status}`,
          to: "/propuestas",
          icon: FileText,
        });
      }
    });

    users.forEach((u) => {
      if (match(u.fullName) || match(u.email) || match(u.department) || match(u.jobTitle)) {
        out.push({
          id: u.id,
          type: "Usuario",
          title: u.fullName,
          subtitle: `${u.jobTitle} · ${u.email}`,
          to: "/usuarios",
          icon: UserCog,
        });
      }
    });

    facturas.forEach((f) => {
      if (match(f.proveedor) || match(f.numDocumento) || match(f.ruc) || match(f.id)) {
        out.push({
          id: f.id,
          type: "Factura",
          title: f.numDocumento,
          subtitle: `${f.proveedor} · ${f.estado}`,
          to: "/finanzas",
          icon: Receipt,
        });
      }
    });

    PLANS.forEach((p) => {
      if (match(p.name) || match(p.tagline)) {
        out.push({
          id: p.id,
          type: "Plan",
          title: p.name,
          subtitle: p.tagline,
          to: "/planes",
          icon: Package,
        });
      }
    });

    APPS.forEach((a) => {
      if (match(a.name) || match(a.description)) {
        out.push({
          id: a.id,
          type: "App",
          title: a.name,
          subtitle: a.description,
          to: "/apps",
          icon: LayoutGrid,
        });
      }
    });

    PAGES.forEach((p) => {
      if (match(p.title)) out.push({ ...p, icon: FileQuestion });
    });

    return out.slice(0, 30);
  }, [q, clients, users, proposals, facturas]);

  useEffect(() => setActiveIdx(0), [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (r: Result) => {
    navigate(r.to);
    setOpen(false);
    setQ("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      e.preventDefault();
      go(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Buscar leads, clientes, propuestas, facturas..."
        className="h-10 w-[280px] rounded-lg border-border bg-background pl-9"
      />
      {open && q.trim() && (
        <div className="absolute right-0 top-12 z-50 w-[420px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Sin resultados para "{q}".
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto py-1">
              {results.map((r, idx) => {
                const Icon = r.icon;
                return (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => go(r)}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition-base",
                        idx === activeIdx ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                      )}
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium">{r.title}</span>
                          <span className="shrink-0 rounded-full border border-border px-1.5 py-px text-[10px] text-muted-foreground">
                            {r.type}
                          </span>
                        </span>
                        {r.subtitle && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {r.subtitle}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
