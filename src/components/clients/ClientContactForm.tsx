import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientContact } from "@/data/clientExtras";

type Props = {
  initial?: Partial<ClientContact>;
  onSubmit: (c: Omit<ClientContact, "id" | "clientId">) => void;
  onCancel: () => void;
};

export function ClientContactForm({ initial, onSubmit, onCancel }: Props) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({
      fullName: fullName.trim(),
      role: role.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cf-name">Nombre completo *</Label>
          <Input id="cf-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-role">Cargo / Área</Label>
          <Input id="cf-role" value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} placeholder="Finanzas, TI, Compras..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-email">Email *</Label>
          <Input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-phone">Teléfono</Label>
          <Input id="cf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="shadow-glow">{initial?.fullName ? "Guardar cambios" : "Crear contacto"}</Button>
      </div>
    </form>
  );
}
