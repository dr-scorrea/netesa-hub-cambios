import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinanzas } from "@/context/FinanzasContext";
import { CATEGORIAS, type Factura } from "@/data/finanzas";
import { CheckCircle2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/**
 * Modal específico para VALIDAR un documento extraído por IA y enviarlo
 * a aprobación o rechazarlo. Visualmente diferenciado del modal de edición.
 */
export function FacturaValidateDialog({
  factura,
  open,
  onOpenChange,
}: {
  factura: Factura | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { updateFactura, setEstado } = useFinanzas();
  const [form, setForm] = useState<Factura | null>(factura);

  useEffect(() => setForm(factura), [factura]);

  if (!form) return null;

  const recomputeTotal = (subtotal: number, igv: number) =>
    Math.round((subtotal + igv) * 100) / 100;

  const handleEnviar = () => {
    updateFactura(form.id, form);
    setEstado(form.id, "pendiente");
    toast({
      title: "Documento validado",
      description: `${form.proveedor} enviado a aprobación.`,
    });
    onOpenChange(false);
  };

  const handleRechazar = () => {
    setEstado(form.id, "rechazada");
    toast({
      title: "Documento rechazado",
      description: form.numDocumento,
      variant: "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Validar documento</DialogTitle>
              <DialogDescription>
                Revisa los datos extraídos y envíalos a aprobación.
              </DialogDescription>
            </div>
          </div>
          {form.leidoPorIA && (
            <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Datos pre-rellenados por IA · {form.archivoNombre}
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="v-proveedor">Proveedor</Label>
            <Input
              id="v-proveedor"
              value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-ruc">RUC</Label>
            <Input
              id="v-ruc"
              value={form.ruc}
              maxLength={11}
              onChange={(e) => setForm({ ...form, ruc: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-num">N° documento</Label>
            <Input
              id="v-num"
              value={form.numDocumento}
              onChange={(e) => setForm({ ...form, numDocumento: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-fecha">Fecha de emisión</Label>
            <Input
              id="v-fecha"
              type="date"
              value={form.fechaEmision}
              onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-moneda">Moneda</Label>
            <Select
              value={form.moneda}
              onValueChange={(v) => setForm({ ...form, moneda: v as Factura["moneda"] })}
            >
              <SelectTrigger id="v-moneda">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">PEN — Soles</SelectItem>
                <SelectItem value="USD">USD — Dólares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-subtotal">Subtotal</Label>
            <Input
              id="v-subtotal"
              type="number"
              step="0.01"
              value={form.subtotal}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setForm({ ...form, subtotal: v, total: recomputeTotal(v, form.igv) });
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-igv">IGV (18%)</Label>
            <Input
              id="v-igv"
              type="number"
              step="0.01"
              value={form.igv}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setForm({ ...form, igv: v, total: recomputeTotal(form.subtotal, v) });
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-total">Total</Label>
            <Input
              id="v-total"
              type="number"
              step="0.01"
              value={form.total}
              onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })}
              className="font-semibold"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="v-categoria">Categoría contable</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm({ ...form, categoria: v })}
            >
              <SelectTrigger id="v-categoria">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRechazar}>
            <XCircle className="h-4 w-4" />
            Rechazar documento
          </Button>
          <Button onClick={handleEnviar} className="shadow-glow">
            <CheckCircle2 className="h-4 w-4" />
            Validar y enviar a aprobación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
