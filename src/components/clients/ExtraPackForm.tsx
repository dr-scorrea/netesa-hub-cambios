import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  EXTRA_PACK_DEFAULT_UNIT,
  EXTRA_PACK_KIND_LABEL,
  type ExtraPack,
  type ExtraPackKind,
} from "@/data/clientExtras";
import { APPS, type AppId } from "@/data/apps";
import type { Currency } from "@/data/crm";

type Props = {
  /** Apps disponibles (para asociar el pack). */
  availableApps: AppId[];
  initial?: Partial<ExtraPack>;
  onSubmit: (p: Omit<ExtraPack, "id" | "clientId">) => void;
  onCancel: () => void;
};

export function ExtraPackForm({ availableApps, initial, onSubmit, onCancel }: Props) {
  const fallbackApp = (availableApps[0] ?? "nodlex") as AppId;
  const [appId, setAppId] = useState<AppId>(initial?.appId ?? fallbackApp);
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<ExtraPackKind>(initial?.kind ?? "usuarios");
  const [quantity, setQuantity] = useState<number>(initial?.quantity ?? 1);
  const [unit, setUnit] = useState<string>(initial?.unit ?? EXTRA_PACK_DEFAULT_UNIT["usuarios"]);
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? "PEN");
  const [billingCycle, setBilling] = useState<ExtraPack["billingCycle"]>(initial?.billingCycle ?? "mensual");
  const [startDate, setStart] = useState(initial?.startDate ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  // Si cambia el tipo, sugerimos unidad coherente (sin pisar ediciones manuales)
  useEffect(() => {
    if (!initial) setUnit(EXTRA_PACK_DEFAULT_UNIT[kind]);
  }, [kind, initial]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      appId,
      name: name.trim(),
      kind,
      quantity,
      unit: unit.trim() || EXTRA_PACK_DEFAULT_UNIT[kind],
      price,
      currency,
      billingCycle,
      startDate,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pk-name">Nombre del pack *</Label>
          <Input id="pk-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} placeholder="Ej. Pack 10 usuarios extra" />
        </div>
        <div className="space-y-1.5">
          <Label>App</Label>
          <Select value={appId} onValueChange={(v) => setAppId(v as AppId)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(availableApps.length > 0 ? availableApps : (APPS.filter((a) => a.category === "saas").map((a) => a.id) as AppId[])).map((id) => {
                const app = APPS.find((a) => a.id === id);
                return <SelectItem key={id} value={id}>{app?.name ?? id}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as ExtraPackKind)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(EXTRA_PACK_KIND_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Ciclo</Label>
          <Select value={billingCycle} onValueChange={(v) => setBilling(v as ExtraPack["billingCycle"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="unico">Pago único</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pk-qty">Cantidad</Label>
          <Input id="pk-qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pk-unit">Unidad</Label>
          <Input id="pk-unit" value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={30} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pk-start">Inicio</Label>
          <Input id="pk-start" type="date" value={startDate} onChange={(e) => setStart(e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Moneda</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">PEN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="CLP">CLP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pk-price">Precio</Label>
          <Input id="pk-price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pk-notes">Notas</Label>
        <Textarea id="pk-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={400} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="shadow-glow">{initial?.name ? "Guardar cambios" : "Crear pack"}</Button>
      </div>
    </form>
  );
}
