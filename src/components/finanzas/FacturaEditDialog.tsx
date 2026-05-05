import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinanzas } from "@/context/FinanzasContext";
import { CATEGORIAS, type Factura } from "@/data/finanzas";
import { Pencil, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function FacturaEditDialog({
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

  const handleSave = () => {
    updateFactura(form.id, form);
    toast({
      title: "Cambios guardados",
      description: `${form.proveedor} actualizado correctamente.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Editar factura</DialogTitle>
              <DialogDescription>{form.archivoNombre}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input
              id="proveedor"
              value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              value={form.ruc}
              maxLength={11}
              onChange={(e) => setForm({ ...form, ruc: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numDocumento">N° documento</Label>
            <Input
              id="numDocumento"
              value={form.numDocumento}
              onChange={(e) => setForm({ ...form, numDocumento: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fecha">Fecha de emisión</Label>
            <Input
              id="fecha"
              type="date"
              value={form.fechaEmision}
              onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="moneda">Moneda</Label>
            <Select
              value={form.moneda}
              onValueChange={(v) => setForm({ ...form, moneda: v as Factura["moneda"] })}
            >
              <SelectTrigger id="moneda">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">PEN — Soles</SelectItem>
                <SelectItem value="USD">USD — Dólares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subtotal">Subtotal</Label>
            <Input
              id="subtotal"
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
            <Label htmlFor="igv">IGV (18%)</Label>
            <Input
              id="igv"
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
            <Label htmlFor="total">Total</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              value={form.total}
              onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })}
              className="font-semibold"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="categoria">Categoría contable</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm({ ...form, categoria: v })}
            >
              <SelectTrigger id="categoria">
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
          <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Save className="h-4 w-4" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
