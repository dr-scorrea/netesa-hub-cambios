import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client } from "@/data/clients";

const OWNERS = ["Lucía Ramírez", "Diego Torres", "Camila Soto", "Andrés Vega"];
const INDUSTRIES = [
  "Servicios legales",
  "Fintech",
  "Logística",
  "Construcción",
  "Retail",
  "Educación",
  "Salud",
  "Tecnología",
  "Manufactura",
  "Otros",
];

export function ClientForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Client;
  onSubmit: (c: Omit<Client, "id" | "createdAt"> & { id?: string }) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Omit<Client, "id" | "createdAt">>({
    legalName: initial?.legalName ?? "",
    tradeName: initial?.tradeName ?? "",
    taxId: initial?.taxId ?? "",
    country: initial?.country ?? "PE",
    industry: initial?.industry ?? "Servicios legales",
    contactName: initial?.contactName ?? "",
    contactEmail: initial?.contactEmail ?? "",
    contactPhone: initial?.contactPhone ?? "",
    status: initial?.status ?? "trial",
    accountManager: initial?.accountManager ?? OWNERS[0],
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalName.trim() || !form.contactEmail.trim()) return;
    onSubmit({ ...form, id: initial?.id });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Razón social</Label>
          <Input
            value={form.legalName}
            onChange={(e) => set("legalName", e.target.value)}
            required
            maxLength={150}
          />
        </div>
        <div>
          <Label>Nombre comercial</Label>
          <Input
            value={form.tradeName}
            onChange={(e) => set("tradeName", e.target.value)}
            maxLength={80}
          />
        </div>
        <div>
          <Label>RUC / Tax ID</Label>
          <Input value={form.taxId} onChange={(e) => set("taxId", e.target.value)} maxLength={20} />
        </div>
        <div>
          <Label>País</Label>
          <Select value={form.country} onValueChange={(v) => set("country", v as Client["country"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PE">Perú</SelectItem>
              <SelectItem value="CL">Chile</SelectItem>
              <SelectItem value="MX">México</SelectItem>
              <SelectItem value="CO">Colombia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Industria</Label>
          <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-accent/30 p-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Contacto principal</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Nombre"
            value={form.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            maxLength={100}
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            required
            maxLength={150}
          />
          <Input
            placeholder="Teléfono"
            value={form.contactPhone}
            onChange={(e) => set("contactPhone", e.target.value)}
            maxLength={30}
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Estado</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v as Client["status"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="trial">En trial</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Account manager</Label>
          <Select value={form.accountManager} onValueChange={(v) => set("accountManager", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OWNERS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
          {initial ? "Guardar cambios" : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}
