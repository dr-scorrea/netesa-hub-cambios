import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserCog,
  Plus,
  Search,
  Mail,
  Phone,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  Users as UsersIcon,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import { useUsers } from "@/context/UsersContext";
import { UserForm } from "@/components/users/UserForm";
import { ROLE_LABEL, STATUS_LABEL, type AppUser, type UserRole, type UserStatus } from "@/data/users";
import { toast } from "@/hooks/use-toast";

export default function Usuarios() {
  const { users, addUser, updateUser, removeUser } = useUsers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AppUser | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.jobTitle.toLowerCase().includes(q)
      );
    });
  }, [users, search, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    const activos = users.filter((u) => u.status === "activo").length;
    const invitados = users.filter((u) => u.status === "invitado").length;
    const suspendidos = users.filter((u) => u.status === "suspendido").length;
    const admins = users.filter((u) => u.role === "admin").length;
    return { activos, invitados, suspendidos, admins };
  }, [users]);

  const handleDelete = () => {
    if (!confirmDelete) return;
    removeUser(confirmDelete.id);
    toast({ title: "Usuario eliminado", description: confirmDelete.fullName });
    setConfirmDelete(null);
  };

  const toggleStatus = (u: AppUser, status: UserStatus) => {
    updateUser(u.id, { status });
    toast({ title: "Estado actualizado", description: `${u.fullName} → ${STATUS_LABEL[status]}` });
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Equipo interno de Netesa con acceso al ecosistema. Gestiona roles, estados y accesos."
        icon={<UserCog className="h-5 w-5" />}
        actions={
          <Button onClick={() => setShowCreate(true)} className="shadow-glow">
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<UsersIcon className="h-4 w-4" />} label="Activos" value={stats.activos.toString()} hint={`${users.length} totales`} tone="success" />
        <StatCard icon={<UserPlus className="h-4 w-4" />} label="Invitados" value={stats.invitados.toString()} hint="Pendientes de activar" tone="info" />
        <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Administradores" value={stats.admins.toString()} hint="Acceso total" tone="primary" />
        <StatCard icon={<ShieldAlert className="h-4 w-4" />} label="Suspendidos" value={stats.suspendidos.toString()} hint="Sin acceso" tone="warning" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, departamento…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | "all")}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Rol" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {Object.entries(ROLE_LABEL).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No hay usuarios que coincidan con los filtros.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((u) => {
                const initials = u.fullName.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase();
                return (
                  <div
                    key={u.id}
                    className="group flex items-center gap-4 px-4 py-3 transition-base hover:bg-accent/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold">{u.fullName}</span>
                        <UserStatusBadge status={u.status} />
                        <RoleBadge role={u.role} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {u.jobTitle ? `${u.jobTitle} · ` : ""}{u.department} · {u.email}
                      </p>
                    </div>
                    <div className="hidden items-center gap-1 sm:flex">
                      <a
                        href={`mailto:${u.email}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-base hover:bg-accent hover:text-foreground"
                        title="Enviar email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      {u.phone && (
                        <a
                          href={`tel:${u.phone}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-base hover:bg-accent hover:text-foreground"
                          title={u.phone}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setEditing(u)}>
                          <Pencil className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        {u.status !== "activo" && (
                          <DropdownMenuItem onClick={() => toggleStatus(u, "activo")}>
                            <UserCheck className="h-4 w-4" /> Activar
                          </DropdownMenuItem>
                        )}
                        {u.status !== "suspendido" && (
                          <DropdownMenuItem onClick={() => toggleStatus(u, "suspendido")}>
                            <UserX className="h-4 w-4" /> Suspender
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setConfirmDelete(u)}
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>
              Invita a un miembro del equipo. Recibirá un correo para activar su cuenta.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={(data) => {
              const id = `USR-${String(Date.now()).slice(-4)}`;
              addUser({ ...data, id, createdAt: new Date().toISOString() });
              toast({ title: "Usuario creado", description: data.fullName });
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Actualiza los datos y permisos del usuario.</DialogDescription>
          </DialogHeader>
          {editing && (
            <UserForm
              initial={editing}
              onSubmit={(data) => {
                updateUser(editing.id, data);
                toast({ title: "Usuario actualizado", description: data.fullName });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará a <strong>{confirmDelete?.fullName}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    activo: "bg-success/15 text-success border-success/30",
    invitado: "bg-info/10 text-info border-info/30",
    suspendido: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      {ROLE_LABEL[role]}
    </span>
  );
}

function StatCard({
  icon, label, value, hint, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "warning" | "info" | "success";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    info: "bg-info/10 text-info",
    success: "bg-success/15 text-success",
  }[tone];
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
