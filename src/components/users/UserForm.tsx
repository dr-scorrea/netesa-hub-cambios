import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DEPARTMENTS,
  ROLE_LABEL,
  STATUS_LABEL,
  type AppUser,
  type UserRole,
  type UserStatus,
} from "@/data/users";

type Props = {
  initial?: Partial<AppUser>;
  onSubmit: (u: Omit<AppUser, "id" | "createdAt">) => void;
  onCancel: () => void;
};

export function UserForm({ initial, onSubmit, onCancel }: Props) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [role, setRole] = useState<UserRole>(initial?.role ?? "comercial");
  const [status, setStatus] = useState<UserStatus>(initial?.status ?? "invitado");
  const [department, setDepartment] = useState(initial?.department ?? "Comercial");
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    onSubmit({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      role,
      status,
      department,
      jobTitle: jobTitle.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Cargo</Label>
          <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label>Departamento</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Rol</Label>
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABEL).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="shadow-glow">Guardar</Button>
      </div>
    </form>
  );
}
