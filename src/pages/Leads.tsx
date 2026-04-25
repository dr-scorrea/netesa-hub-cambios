import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Nuevo lead</SheetTitle>
                <SheetDescription>Asocia el prospecto a una de las Apps del ecosistema.</SheetDescription>
              </SheetHeader>
              <LeadForm onSubmit={handleCreate} defaultAppId={activeApp !== "all" ? activeApp : undefined} />
            </SheetContent>
          </Sheet>
        }
      />

      <Card className="border-border bg-card shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
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
              <SelectTrigger className="h-10 w-[160px]">
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

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[260px]">Lead</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead className="text-right">Valor estimado</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No hay leads que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((l) => (
                  <TableRow key={l.id} className="transition-base hover:bg-accent/30">
                    <TableCell>
                      <div className="font-semibold leading-tight">{l.fullName}</div>
                      <div className="text-xs text-muted-foreground">{l.company}</div>
                    </TableCell>
                    <TableCell>
                      <AppBadge appId={l.appId} size="xs" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-xs font-semibold uppercase", PRIORITY_COLOR[l.priority])}>● {l.priority}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(l.estimatedValue, l.currency)}
                    </TableCell>
                    <TableCell className="text-sm">{l.owner}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
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
