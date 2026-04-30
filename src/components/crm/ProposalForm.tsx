import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEADS, PLANS, type Currency, type Proposal } from "@/data/crm";
import { APPS, type AppId } from "@/data/apps";

type FormState = Omit<Proposal, "id" | "createdAt">;

export function ProposalForm({
  initial,
  onSubmit,
  submitLabel = "Crear propuesta",
}: {
  initial?: Proposal;
  onSubmit: (p: FormState) => void;
  submitLabel?: string;
}) {
  const defaultLead = initial ? LEADS.find((l) => l.id === initial.leadId) : LEADS[0];
  const defaultAppId: AppId = initial?.appId ?? defaultLead?.appId ?? "nodlex";

  const [form, setForm] = useState<FormState>(() => ({
    leadId: initial?.leadId ?? defaultLead?.id ?? "",
    appId: defaultAppId,
    planId: initial?.planId ?? PLANS.find((p) => p.appId === defaultAppId)?.id ?? "",
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? "PEN",
    status: initial?.status ?? "borrador",
    validUntil:
      initial?.validUntil?.slice(0, 10) ??
      new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  }));

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Cuando cambia el lead, actualizar la app y el plan por defecto.
  useEffect(() => {
    const lead = LEADS.find((l) => l.id === form.leadId);
    if (lead && lead.appId !== form.appId) {
      const firstPlan = PLANS.find((p) => p.appId === lead.appId);
      setForm((f) => ({
        ...f,
        appId: lead.appId,
        planId: firstPlan?.id ?? "",
        currency: lead.currency,
        amount: firstPlan?.prices[lead.currency] ?? f.amount,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.leadId]);

  const plansForApp = useMemo(() => PLANS.filter((p) => p.appId === form.appId), [form.appId]);

  // Cuando cambia el plan, sugerir monto según moneda.
  const onPlanChange = (planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    setForm((f) => ({
      ...f,
      planId,
      amount: plan?.prices[f.currency] ?? f.amount,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.leadId || !form.planId || !form.validUntil) return;
    onSubmit({
      ...form,
      validUntil: new Date(form.validUntil).toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-4">
      <div>
        <Label>Lead asociado *</Label>
        <Select value={form.leadId} onValueChange={(v) => set("leadId", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Selecciona un lead" />
          </SelectTrigger>
          <SelectContent>
            {LEADS.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.fullName} — {l.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-accent/30 p-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">App</Label>
        <Select value={form.appId} onValueChange={(v) => {
          const appId = v as AppId;
          const firstPlan = PLANS.find((p) => p.appId === appId);
          setForm((f) => ({ ...f, appId, planId: firstPlan?.id ?? "", amount: firstPlan?.prices[f.currency] ?? f.amount }));
        }}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            {APPS.filter((a) => a.category === "saas").map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Plan *</Label>
        <Select value={form.planId} onValueChange={onPlanChange}>
          <SelectTrigger className="mt-1.5">
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Monto</Label>
          <Input
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => set("amount", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Moneda</Label>
          <Select value={form.currency} onValueChange={(v) => set("currency", v as Currency)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">PEN — Soles</SelectItem>
              <SelectItem value="USD">USD — Dólares</SelectItem>
              <SelectItem value="CLP">CLP — Pesos chilenos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Estado</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as Proposal["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="enviada">Enviada</SelectItem>
              <SelectItem value="aceptada">Aceptada</SelectItem>
              <SelectItem value="rechazada">Rechazada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Válida hasta</Label>
          <Input
            type="date"
            value={form.validUntil.slice(0, 10)}
            onChange={(e) => set("validUntil", e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
        {submitLabel}
      </Button>
    </form>
  );
}
