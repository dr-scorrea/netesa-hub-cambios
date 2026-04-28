import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CLIENT_USER_ROLE_LABEL,
  CLIENT_USER_STATUS_LABEL,
  type ClientUser,
  type ClientUserRole,
  type ClientUserStatus,
} from "@/data/clientExtras";
import { APPS, type AppId } from "@/data/apps";

type Props = {
  /** Apps disponibles para asignar (las que el cliente tiene contratadas). */
  availableApps: AppId[];
  initial?: Partial<ClientUser>;
  onSubmit: (u: Omit<ClientUser, "id" | "clientId" | "createdAt">) => void;
  onCancel: () => void;
};

export function ClientUserForm({ availableApps, initial, onSubmit, onCancel }: Props) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<ClientUserRole>(initial?.role ?? "miembro");
  const [status, setStatus] = useState<ClientUserStatus>(initial?.status ?? "invitado");
  const [apps, setApps] = useState<AppId[]>(initial?.apps ?? []);

  const toggleApp = (app: AppId) =>
    setApps((prev) => (prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      role,
      status,
      apps,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cu-name">Nombre completo *</Label>
          <Input id="cu-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cu-email">Email *</Label>
          <Input id="cu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
        </div>
        <div className="space-y-1.5">
          <Label>Rol</Label>
          <Select value={role} onValueChange={(v) => setRole(v as ClientUserRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CLIENT_USER_ROLE_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ClientUserStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CLIENT_USER_STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Apps con acceso</Label>
        {availableApps.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
            Este cliente todavía no tiene Apps contratadas. Asigna planes primero.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {availableApps.map((appId) => {
              const app = APPS.find((a) => a.id === appId);
              return (
                <label
                  key={appId}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-base hover:bg-accent/40"
                >
                  <Checkbox
                    checked={apps.includes(appId)}
                    onCheckedChange={() => toggleApp(appId)}
                  />
                  <span className="font-medium">{app?.name ?? appId}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="shadow-glow">{initial?.fullName ? "Guardar cambios" : "Crear usuario"}</Button>
      </div>
    </form>
  );
}
