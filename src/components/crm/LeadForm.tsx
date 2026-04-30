import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPS, type AppId } from "@/data/apps";
import type { Lead } from "@/data/crm";

export function LeadForm({
  onSubmit,
  defaultAppId,
}: {
  onSubmit: (lead: Omit<Lead, "id" | "createdAt">) => void;
  defaultAppId?: AppId;
}) {
  const [form, setForm] = useState<Omit<Lead, "id" | "createdAt">>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    appId: defaultAppId ?? "nodlex",
    status: "nuevo",
    priority: "media",
    source: "Web",
    estimatedValue: 0,
    currency: "PEN",
    notes: "",
    owner: "Lucía Ramírez",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.company.trim() || !form.email.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Label>Nombre completo</Label>
          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required maxLength={100} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>Empresa</Label>
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} required maxLength={120} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required maxLength={200} />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-accent/30 p-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">App de interés *</Label>
        <Select value={form.appId} onValueChange={(v) => set("appId", v as AppId)}>
          <SelectTrigger className="mt-1.5">
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Estado</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as Lead["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nuevo">Nuevo</SelectItem>
              <SelectItem value="contactado">Contactado</SelectItem>
              <SelectItem value="diagnostico">Diagnóstico</SelectItem>
              <SelectItem value="propuesta">Propuesta</SelectItem>
              <SelectItem value="ganado">Ganado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v as Lead["priority"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Origen</Label>
          <Select value={form.source} onValueChange={(v) => set("source", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Web", "LinkedIn", "Referido", "Evento", "Inbound email"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Owner</Label>
          <Select value={form.owner} onValueChange={(v) => set("owner", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Lucía Ramírez", "Diego Torres", "Camila Soto", "Andrés Vega"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Valor estimado</Label>
          <Input
            type="number"
            min={0}
            value={form.estimatedValue}
            onChange={(e) => set("estimatedValue", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Moneda</Label>
          <Select value={form.currency} onValueChange={(v) => set("currency", v as Lead["currency"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">PEN — Soles</SelectItem>
              <SelectItem value="USD">USD — Dólares</SelectItem>
              <SelectItem value="CLP">CLP — Pesos chilenos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Notas / diagnóstico</Label>
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} maxLength={1000} />
      </div>

      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
        Crear lead
      </Button>
    </form>
  );
}
