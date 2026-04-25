import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPS, type AppId } from "@/data/apps";
import { PLANS, type Currency } from "@/data/crm";
import type { Subscription } from "@/data/clients";
import { Sparkles } from "lucide-react";

export function SubscriptionForm({
  clientId,
  initial,
  onSubmit,
  onCancel,
}: {
  clientId: string;
  initial?: Subscription;
  onSubmit: (s: Subscription) => void;
  onCancel: () => void;
}) {
  const [appId, setAppId] = useState<AppId>(initial?.appId ?? "nodlex");
  const [planId, setPlanId] = useState<string>(initial?.planId ?? "");
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? "PEN");
  const [billingCycle, setBillingCycle] = useState<Subscription["billingCycle"]>(
    initial?.billingCycle ?? "mensual",
  );
  const [status, setStatus] = useState<Subscription["status"]>(initial?.status ?? "trial");
  const [seatsAssigned, setSeats] = useState(initial?.seatsAssigned ?? 1);
  const [discountPct, setDiscount] = useState(initial?.discountPct ?? 0);
  const [startDate, setStart] = useState(initial?.startDate ?? new Date().toISOString().slice(0, 10));
  const [renewalDate, setRenewal] = useState(
    initial?.renewalDate ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const plansForApp = useMemo(() => PLANS.filter((p) => p.appId === appId), [appId]);
  const selectedPlan = useMemo(() => PLANS.find((p) => p.id === planId), [planId]);

  // Auto-set first plan when app changes
  useMemo(() => {
    if (!plansForApp.find((p) => p.id === planId)) {
      setPlanId(plansForApp[0]?.id ?? "");
    }
  }, [plansForApp, planId]);

  const listPrice = selectedPlan?.prices[currency] ?? 0;
  const negotiatedPrice = useMemo(
    () => Math.round(listPrice * (1 - discountPct / 100) * 100) / 100,
    [listPrice, discountPct],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const sub: Subscription = {
      id: initial?.id ?? `SUB-${Date.now().toString().slice(-6)}`,
      clientId,
      appId,
      planId: selectedPlan.id,
      status,
      billingCycle,
      negotiatedPrice,
      currency,
      discountPct,
      seatsAssigned,
      startDate,
      renewalDate,
      notes: notes.trim() || undefined,
    };
    onSubmit(sub);
  };

  const seatLimit = selectedPlan?.maxUsers === "Ilimitado" ? Infinity : (selectedPlan?.maxUsers ?? 0);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Aplicación</Label>
          <Select value={appId} onValueChange={(v) => setAppId(v as AppId)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPS.filter((a) => a.category === "saas").map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Plan</Label>
          <Select value={planId} onValueChange={setPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un plan" />
            </SelectTrigger>
            <SelectContent>
              {plansForApp.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPlan && (
        <div className="rounded-lg border border-border bg-accent/30 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {selectedPlan.name}
          </div>
          <p className="mt-1 text-muted-foreground">{selectedPlan.tagline}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            <span>Límite: <strong className="text-foreground">{selectedPlan.maxUsers} usuarios</strong></span>
            <span><strong className="text-foreground">{selectedPlan.storageGB} GB</strong> storage</span>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Moneda</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">PEN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="CLP">CLP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Ciclo</Label>
          <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as Subscription["billingCycle"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Subscription["status"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="morosa">Morosa</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Descuento %</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={discountPct}
            onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Precio (calculado)</Label>
          <div className="mt-2 flex items-baseline gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
            <span className="text-lg font-bold tabular-nums">
              {currency} {negotiatedPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">/ {billingCycle === "mensual" ? "mes" : "año"}</span>
            {discountPct > 0 && listPrice > 0 && (
              <span className="ml-auto text-xs text-muted-foreground line-through">
                {currency} {listPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Usuarios asignados</Label>
          <Input
            type="number"
            min={1}
            max={Number.isFinite(seatLimit) ? seatLimit : undefined}
            value={seatsAssigned}
            onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
          />
          {selectedPlan && Number.isFinite(seatLimit) && seatsAssigned > seatLimit && (
            <p className="mt-1 text-xs text-destructive">Excede el límite del plan ({seatLimit})</p>
          )}
        </div>
        <div>
          <Label>Inicio</Label>
          <Input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} required />
        </div>
        <div>
          <Label>Renovación</Label>
          <Input type="date" value={renewalDate} onChange={(e) => setRenewal(e.target.value)} required />
        </div>
      </div>

      <div>
        <Label>Notas</Label>
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={400} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!selectedPlan}
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {initial ? "Guardar cambios" : "Asignar suscripción"}
        </Button>
      </div>
    </form>
  );
}
