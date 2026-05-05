import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  Banknote,
  Trash2,
  TrendingUp,
  Sparkles,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FacturaUploader } from "@/components/finanzas/FacturaUploader";
import { FacturaStatusBadge } from "@/components/finanzas/FacturaStatusBadge";
import { FacturaEditDialog } from "@/components/finanzas/FacturaEditDialog";
import { FacturaValidateDialog } from "@/components/finanzas/FacturaValidateDialog";
import { useFinanzas } from "@/context/FinanzasContext";
import { exportFacturasToExcel } from "@/lib/exportFacturas";
import type { Factura, FacturaEstado } from "@/data/finanzas";
import { toast } from "@/hooks/use-toast";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

const formatMoney = (v: number, m: string) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: m, minimumFractionDigits: 2 }).format(v);

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Finanzas() {
  const { facturas, setEstado, removeFactura } = useFinanzas();
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<FacturaEstado | "all">("all");
  const [editing, setEditing] = useState<Factura | null>(null);
  const [validating, setValidating] = useState<Factura | null>(null);
  const [toDelete, setToDelete] = useState<Factura | null>(null);
  const now = new Date();
  const [periodMonth, setPeriodMonth] = useState<number>(now.getMonth());
  const [periodYear, setPeriodYear] = useState<number>(now.getFullYear());

  const availableYears = useMemo(() => {
    const ys = new Set<number>([new Date().getFullYear()]);
    facturas.forEach((f) => {
      if (f.fechaEmision) ys.add(new Date(f.fechaEmision).getFullYear());
    });
    return Array.from(ys).sort((a, b) => b - a);
  }, [facturas]);

  const inPeriod = (f: Factura) => {
    if (!f.fechaEmision) return false;
    const d = new Date(f.fechaEmision);
    return d.getFullYear() === periodYear && d.getMonth() === periodMonth;
  };

  const periodFacturas = useMemo(
    () => facturas.filter(inPeriod),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [facturas, periodMonth, periodYear],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return periodFacturas.filter((f) => {
      if (filterEstado !== "all" && f.estado !== filterEstado) return false;
      if (!q) return true;
      return (
        f.proveedor.toLowerCase().includes(q) ||
        f.ruc.includes(q) ||
        f.numDocumento.toLowerCase().includes(q)
      );
    });
  }, [periodFacturas, search, filterEstado]);

  const stats = useMemo(() => {
    const pendientes = periodFacturas.filter((f) => f.estado === "pendiente").length;
    const porRevisar = periodFacturas.filter((f) => f.estado === "revision" || f.estado === "extraccion").length;
    const totalAprobadoPEN = periodFacturas
      .filter((f) => f.moneda === "PEN" && (f.estado === "aprobada" || f.estado === "pagada"))
      .reduce((s, f) => s + f.total, 0);
    const procesadasIA = periodFacturas.filter((f) => f.leidoPorIA).length;
    const tasaIA = periodFacturas.length ? Math.round((procesadasIA / periodFacturas.length) * 100) : 0;
    return { pendientes, porRevisar, totalAprobadoPEN, tasaIA, totalPeriodo: periodFacturas.length };
  }, [periodFacturas]);

  const shiftMonth = (delta: number) => {
    let m = periodMonth + delta;
    let y = periodYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setPeriodMonth(m);
    setPeriodYear(y);
  };

  const periodLabel = `${MESES[periodMonth]} ${periodYear}`;

  const handleExport = () => {
    if (filtered.length === 0) {
      toast({ title: "Sin facturas", description: `No hay facturas en ${periodLabel}.`, variant: "destructive" });
      return;
    }
    exportFacturasToExcel(
      filtered,
      `reporte-contable-netesa-${periodYear}-${String(periodMonth + 1).padStart(2, "0")}.xlsx`,
    );
    toast({
      title: "Reporte contable generado",
      description: `${filtered.length} facturas de ${periodLabel} exportadas a Excel.`,
    });
  };

  const handleAprobar = (f: Factura) => {
    setEstado(f.id, "aprobada");
    toast({ title: "Factura aprobada", description: `${f.proveedor} · ${formatMoney(f.total, f.moneda)}` });
  };
  const handleRechazar = (f: Factura) => {
    setEstado(f.id, "rechazada");
    toast({ title: "Factura rechazada", description: f.numDocumento, variant: "destructive" });
  };
  const handlePagar = (f: Factura) => {
    setEstado(f.id, "pagada");
    toast({ title: "Pago registrado", description: `${f.proveedor} · ${formatMoney(f.total, f.moneda)}` });
  };

  return (
    <>
      <PageHeader
        title="Finanzas Netesa"
        description="Carga inteligente de facturas de proveedores, validación, aprobación y exportación contable mensual."
        icon={<Wallet className="h-5 w-5" />}
        actions={
          <Button onClick={handleExport} className="shadow-glow">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar {periodLabel}
          </Button>
        }
      />

      {/* Selector de periodo contable */}
      <Card className="mb-4 border-primary/20 bg-gradient-mesh">
        <CardContent className="flex flex-wrap items-center gap-3 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="h-4 w-4 text-primary" />
            Periodo contable:
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shiftMonth(-1)} aria-label="Mes anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={String(periodMonth)} onValueChange={(v) => setPeriodMonth(Number(v))}>
              <SelectTrigger className="h-8 w-[130px] border-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(periodYear)} onValueChange={(v) => setPeriodYear(Number(v))}>
              <SelectTrigger className="h-8 w-[90px] border-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shiftMonth(1)} aria-label="Mes siguiente">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => { setPeriodMonth(now.getMonth()); setPeriodYear(now.getFullYear()); }}
          >
            Hoy
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            <strong className="text-foreground">{stats.totalPeriodo}</strong> facturas en {periodLabel}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Procesadas por IA"
          value={`${stats.tasaIA}%`}
          hint={`${stats.totalPeriodo} en el periodo`}
          tone="primary"
        />
        <StatCard
          icon={<Eye className="h-4 w-4" />}
          label="Por revisar"
          value={stats.porRevisar.toString()}
          hint="Validar datos extraídos"
          tone="warning"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Pendiente aprobación"
          value={stats.pendientes.toString()}
          hint="Requiere autorización"
          tone="info"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Aprobado / pagado (PEN)"
          value={formatMoney(stats.totalAprobadoPEN, "PEN")}
          hint={`Total ${periodLabel}`}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          <FacturaUploader onReadyToValidate={(f) => setValidating(f)} />
          <Card className="border-dashed bg-accent/30">
            <CardContent className="space-y-2 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Flujo automático
              </p>
              <p>
                Subes el comprobante (PDF/imagen), la IA extrae RUC, fecha, subtotal, IGV y total,
                y se abre el formulario de validación para revisar y enviar a aprobación en un solo paso.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por proveedor, RUC o documento…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterEstado} onValueChange={(v) => setFilterEstado(v as FacturaEstado | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="extraccion">Extrayendo IA</SelectItem>
                  <SelectItem value="revision">Por revisar</SelectItem>
                  <SelectItem value="pendiente">Pendiente aprobación</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {periodFacturas.length === 0
                  ? `Sin facturas en ${periodLabel}. Sube comprobantes o cambia el periodo.`
                  : "Ningún resultado para los filtros aplicados."}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((f) => (
                  <div
                    key={f.id}
                    className="group flex w-full items-center gap-4 px-4 py-3 transition-base hover:bg-accent/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                      {f.proveedor.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold">{f.proveedor}</span>
                        <FacturaStatusBadge estado={f.estado} />
                        {f.leidoPorIA && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            <Sparkles className="h-2.5 w-2.5" /> IA
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        RUC {f.ruc} · <span className="font-mono">{f.numDocumento}</span> · {f.categoria}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Emitida {formatDate(f.fechaEmision)}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatMoney(f.total, f.moneda)}
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        IGV {formatMoney(f.igv, f.moneda)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => setEditing(f)}>
                          <Eye className="h-4 w-4" />
                          Ver / editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {f.estado === "pendiente" && (
                          <>
                            <DropdownMenuItem onClick={() => handleAprobar(f)}>
                              <CheckCircle2 className="h-4 w-4" />
                              Aprobar pago
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRechazar(f)}
                              className="text-destructive focus:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                              Rechazar
                            </DropdownMenuItem>
                          </>
                        )}
                        {f.estado === "aprobada" && (
                          <DropdownMenuItem onClick={() => handlePagar(f)}>
                            <Banknote className="h-4 w-4" />
                            Marcar como pagada
                          </DropdownMenuItem>
                        )}
                        {(f.estado === "revision" || f.estado === "extraccion") && (
                          <DropdownMenuItem onClick={() => setValidating(f)}>
                            <CheckCircle2 className="h-4 w-4" />
                            Validar y enviar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setToDelete(f)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FacturaEditDialog factura={editing} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} />
      <FacturaValidateDialog factura={validating} open={!!validating} onOpenChange={(o) => !o && setValidating(null)} />

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="¿Eliminar factura?"
        itemName={toDelete ? `${toDelete.proveedor} · ${toDelete.numDocumento}` : undefined}
        onConfirm={() => {
          if (toDelete) {
            removeFactura(toDelete.id);
            toast({ title: "Factura eliminada", description: toDelete.numDocumento, variant: "destructive" });
          }
          setToDelete(null);
        }}
      />
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "warning" | "info" | "success";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    info: "bg-info/10 text-info",
    success: "bg-success/15 text-success",
  }[tone];
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
