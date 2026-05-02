import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, Filter, Mail, Phone } from "lucide-react";
import { LEADS, type Lead, formatCurrency, STATUS_LABEL } from "@/data/crm";
import { APPS } from "@/data/apps";
import { useAppContext } from "@/context/AppContext";
import { AppBadge } from "@/components/shared/AppBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LeadForm } from "@/components/crm/LeadForm";
import { toast } from "sonner";

const PRIORITY_COLOR: Record<Lead["priority"], string> = {
  alta: "text-destructive",
  media: "text-warning",
  baja: "text-muted-foreground",
};

const Leads = () => {
  const { activeApp, setActiveApp } = useAppContext();
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (activeApp !== "all" && l.appId !== activeApp) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (priorityFilter !== "all" && l.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.fullName.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, activeApp, statusFilter, priorityFilter, search]);

  const handleCreate = (lead: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...lead,
      id: `LD-${1000 + leads.length}`,
      createdAt: new Date().toISOString(),
    };
    setLeads([newLead, ...leads]);
    setOpen(false);
    toast.success("Lead creado", { description: `${newLead.fullName} agregado al pipeline.` });
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Listado único de prospectos del ecosistema. Cada lead se asocia a la SaaS de interés y vive bajo ella en el pipeline."
        icon={<Users className="h-5 w-5" />}
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Plus className="mr-1.5 h-4 w-4" /> Nuevo lead
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
              <SheetHeader className="shrink-0 border-b border-border p-6">
                <SheetTitle>Nuevo lead</SheetTitle>
                <SheetDescription>Asocia el prospecto a una de las Apps del ecosistema.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <LeadForm onSubmit={handleCreate} defaultAppId={activeApp !== "all" ? activeApp : undefined} />
              </div>
            </SheetContent>
          </Sheet>
        }
      />

      <Card className="border-border bg-card shadow-card">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, empresa o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={activeApp} onValueChange={(v) => setActiveApp(v as any)}>
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder="App" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Apps</SelectItem>
                {APPS.filter((a) => a.category === "saas").map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-10 w-[140px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10">
              <Filter className="mr-1.5 h-4 w-4" /> Más filtros
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No hay leads que coincidan con los filtros.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((l) => (
                <div
                  key={l.id}
                  className="group flex w-full items-center gap-4 px-4 py-3 transition-base hover:bg-accent/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                    {l.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold">{l.fullName}</span>
                      <StatusBadge status={l.status} />
                      <span className={cn("text-[10px] font-semibold uppercase tracking-wider", PRIORITY_COLOR[l.priority])}>
                        ● {l.priority}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.company} · {l.email} · Owner: {l.owner}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <AppBadge appId={l.appId} size="sm" />
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(l.estimatedValue, l.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">Valor estimado</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                      <a href={`mailto:${l.email}`} aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                      <a href={`tel:${l.phone}`} aria-label="Llamar">
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Mostrando <strong className="text-foreground">{filtered.length}</strong> de {leads.length} leads
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Leads;
