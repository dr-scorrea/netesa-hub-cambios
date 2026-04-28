import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  ArrowLeft,
  Users,
  Contact,
  CalendarRange,
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useClients } from "@/context/ClientsContext";
import { COUNTRY_LABEL } from "@/data/clients";
import { PLANS, formatCurrency } from "@/data/crm";
import { AppBadge } from "@/components/shared/AppBadge";
import { SubscriptionStatusBadge } from "@/components/clients/SubscriptionStatusBadge";
import { SubscriptionForm } from "@/components/clients/SubscriptionForm";
import { ClientContactForm } from "@/components/clients/ClientContactForm";
import { ClientUserForm } from "@/components/clients/ClientUserForm";
import { ExtraPackForm } from "@/components/clients/ExtraPackForm";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import {
  CLIENT_USER_ROLE_LABEL,
  CLIENT_USER_STATUS_LABEL,
  EXTRA_PACK_KIND_LABEL,
  type ClientContact,
  type ClientUser,
  type ClientUserStatus,
  type ExtraPack,
} from "@/data/clientExtras";
import type { Subscription } from "@/data/clients";
import type { AppId } from "@/data/apps";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type SectionKey = "contactos" | "usuarios" | "planes" | "extras";

const SECTIONS: {
  key: SectionKey;
  label: string;
  icon: typeof Users;
}[] = [
  { key: "contactos", label: "Contactos", icon: Contact },
  { key: "usuarios", label: "Usuarios", icon: Users },
  { key: "planes", label: "Planes", icon: CalendarRange },
  { key: "extras", label: "Pack Extra", icon: Package },
];

type DeleteTarget =
  | { kind: "contact"; item: ClientContact }
  | { kind: "user"; item: ClientUser }
  | { kind: "subscription"; item: Subscription }
  | { kind: "pack"; item: ExtraPack };

export default function ClienteConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    clients,
    subscriptions,
    contacts,
    clientUsers,
    extraPacks,
    addContact,
    updateContact,
    removeContact,
    addClientUser,
    updateClientUser,
    removeClientUser,
    addSubscription,
    updateSubscription,
    removeSubscription,
    addExtraPack,
    updateExtraPack,
    removeExtraPack,
  } = useClients();

  const [section, setSection] = useState<SectionKey>("contactos");
  const [search, setSearch] = useState("");

  // Diálogos contacto
  const [contactDlg, setContactDlg] = useState<{ open: boolean; initial?: ClientContact }>({ open: false });
  // Diálogos usuario
  const [userDlg, setUserDlg] = useState<{ open: boolean; initial?: ClientUser }>({ open: false });
  // Diálogos plan/sub
  const [planDlg, setPlanDlg] = useState<{ open: boolean; initial?: Subscription }>({ open: false });
  // Diálogos pack
  const [packDlg, setPackDlg] = useState<{ open: boolean; initial?: ExtraPack }>({ open: false });

  const [toDelete, setToDelete] = useState<DeleteTarget | null>(null);

  const client = useMemo(() => clients.find((c) => c.id === id), [clients, id]);
  const clientSubs = useMemo(
    () => (client ? subscriptions.filter((s) => s.clientId === client.id) : []),
    [subscriptions, client],
  );
  const clientContacts = useMemo(
    () => (client ? contacts.filter((c) => c.clientId === client.id) : []),
    [contacts, client],
  );
  const clientUsersList = useMemo(
    () => (client ? clientUsers.filter((u) => u.clientId === client.id) : []),
    [clientUsers, client],
  );
  const clientPacks = useMemo(
    () => (client ? extraPacks.filter((p) => p.clientId === client.id) : []),
    [extraPacks, client],
  );

  const availableApps = useMemo<AppId[]>(
    () => Array.from(new Set(clientSubs.map((s) => s.appId))),
    [clientSubs],
  );

  // Filtrado por búsqueda según sección
  const q = search.trim().toLowerCase();
  const filteredContacts = clientContacts.filter(
    (c) => !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.role.toLowerCase().includes(q),
  );
  const filteredUsers = clientUsersList.filter(
    (u) => !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  );
  const filteredSubs = clientSubs.filter((s) => {
    if (!q) return true;
    const plan = PLANS.find((p) => p.id === s.planId);
    return (
      s.appId.toLowerCase().includes(q) ||
      (plan?.name ?? "").toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });
  const filteredPacks = clientPacks.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.appId.toLowerCase().includes(q),
  );

  if (!client) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Cliente no encontrado.
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/clientes")}>
              <ArrowLeft className="h-4 w-4" /> Volver a Clientes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleNew = () => {
    if (section === "contactos") setContactDlg({ open: true });
    if (section === "usuarios") setUserDlg({ open: true });
    if (section === "planes") setPlanDlg({ open: true });
    if (section === "extras") setPackDlg({ open: true });
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    switch (toDelete.kind) {
      case "contact":
        removeContact(toDelete.item.id);
        toast({ title: "Contacto eliminado", description: toDelete.item.fullName });
        break;
      case "user":
        removeClientUser(toDelete.item.id);
        toast({ title: "Usuario eliminado", description: toDelete.item.fullName });
        break;
      case "subscription": {
        const plan = PLANS.find((p) => p.id === toDelete.item.planId);
        removeSubscription(toDelete.item.id);
        toast({ title: "Plan eliminado", description: plan?.name ?? toDelete.item.planId });
        break;
      }
      case "pack":
        removeExtraPack(toDelete.item.id);
        toast({ title: "Pack eliminado", description: toDelete.item.name });
        break;
    }
    setToDelete(null);
  };

  const deleteTargetName = (() => {
    if (!toDelete) return "";
    if (toDelete.kind === "contact") return toDelete.item.fullName;
    if (toDelete.kind === "user") return toDelete.item.fullName;
    if (toDelete.kind === "pack") return toDelete.item.name;
    const plan = PLANS.find((p) => p.id === toDelete.item.planId);
    return plan?.name ?? toDelete.item.planId;
  })();

  const deleteTitle = (() => {
    if (!toDelete) return undefined;
    return {
      contact: "¿Eliminar contacto?",
      user: "¿Eliminar usuario?",
      subscription: "¿Eliminar plan asignado?",
      pack: "¿Eliminar pack extra?",
    }[toDelete.kind];
  })();

  return (
    <>
      {/* Cabecera compacta */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              Configuración de Cliente
            </h1>
            <p className="text-xs text-muted-foreground">
              {client.tradeName} · {client.id} · {COUNTRY_LABEL[client.country]}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
          Volver a Clientes
        </Button>
      </div>

      {/* Banner */}
      <Card className="mb-4 overflow-hidden border-l-4 border-l-primary bg-gradient-mesh">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <Field label="Razón social" value={client.legalName} />
          <Field label="RUC / Tax ID" value={client.taxId} />
          <Field label="Industria" value={client.industry} />
        </CardContent>
      </Card>

      {/* Submenú */}
      <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.key;
          const count =
            s.key === "contactos"
              ? clientContacts.length
              : s.key === "usuarios"
                ? clientUsersList.length
                : s.key === "planes"
                  ? clientSubs.length
                  : clientPacks.length;
          return (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-base",
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{s.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Buscar en ${SECTIONS.find((s) => s.key === section)?.label}…`}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" className="shadow-glow" onClick={handleNew}>
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      {/* Listados */}
      {section === "contactos" && (
        <CardGrid empty="No hay contactos registrados.">
          {filteredContacts.map((c) => (
            <ContactoCard
              key={c.id}
              name={c.fullName}
              role={c.role || "Contacto"}
              email={c.email}
              phone={c.phone}
              country={COUNTRY_LABEL[client.country]}
              onEdit={() => setContactDlg({ open: true, initial: c })}
              onDelete={() => setToDelete({ kind: "contact", item: c })}
            />
          ))}
        </CardGrid>
      )}

      {section === "usuarios" && (
        <CardGrid empty="No hay usuarios registrados.">
          {filteredUsers.map((u) => (
            <UsuarioCard
              key={u.id}
              user={u}
              onEdit={() => setUserDlg({ open: true, initial: u })}
              onDelete={() => setToDelete({ kind: "user", item: u })}
            />
          ))}
        </CardGrid>
      )}

      {section === "planes" && (
        <CardGrid empty="Este cliente todavía no tiene planes asignados.">
          {filteredSubs.map((s) => {
            const plan = PLANS.find((p) => p.id === s.planId);
            return (
              <PlanCard
                key={s.id}
                appId={s.appId}
                plan={plan?.name ?? s.planId}
                status={s.status}
                cycle={s.billingCycle}
                price={formatCurrency(s.negotiatedPrice, s.currency)}
                seats={s.seatsAssigned}
                renewal={new Date(s.renewalDate).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                discount={s.discountPct}
                onEdit={() => setPlanDlg({ open: true, initial: s })}
                onDelete={() => setToDelete({ kind: "subscription", item: s })}
              />
            );
          })}
        </CardGrid>
      )}

      {section === "extras" && (
        <CardGrid empty="Sin packs extra contratados.">
          {filteredPacks.map((p) => (
            <PackCard
              key={p.id}
              pack={p}
              onEdit={() => setPackDlg({ open: true, initial: p })}
              onDelete={() => setToDelete({ kind: "pack", item: p })}
            />
          ))}
        </CardGrid>
      )}

      {/* ─── Dialogs ─── */}
      <Dialog open={contactDlg.open} onOpenChange={(o) => !o && setContactDlg({ open: false })}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{contactDlg.initial ? "Editar contacto" : "Nuevo contacto"}</DialogTitle>
            <DialogDescription>Datos de contacto adicional asociado a este cliente.</DialogDescription>
          </DialogHeader>
          <ClientContactForm
            initial={contactDlg.initial}
            onSubmit={(data) => {
              if (contactDlg.initial) {
                updateContact(contactDlg.initial.id, data);
                toast({ title: "Contacto actualizado", description: data.fullName });
              } else {
                addContact({
                  ...data,
                  id: `CTC-${Date.now().toString().slice(-5)}`,
                  clientId: client.id,
                });
                toast({ title: "Contacto creado", description: data.fullName });
              }
              setContactDlg({ open: false });
            }}
            onCancel={() => setContactDlg({ open: false })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={userDlg.open} onOpenChange={(o) => !o && setUserDlg({ open: false })}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{userDlg.initial ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            <DialogDescription>Personas con acceso a las Apps contratadas por este cliente.</DialogDescription>
          </DialogHeader>
          <ClientUserForm
            availableApps={availableApps}
            initial={userDlg.initial}
            onSubmit={(data) => {
              if (userDlg.initial) {
                updateClientUser(userDlg.initial.id, data);
                toast({ title: "Usuario actualizado", description: data.fullName });
              } else {
                addClientUser({
                  ...data,
                  id: `CUR-${Date.now().toString().slice(-5)}`,
                  clientId: client.id,
                  createdAt: new Date().toISOString(),
                });
                toast({ title: "Usuario creado", description: data.fullName });
              }
              setUserDlg({ open: false });
            }}
            onCancel={() => setUserDlg({ open: false })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={planDlg.open} onOpenChange={(o) => !o && setPlanDlg({ open: false })}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{planDlg.initial ? "Editar plan" : "Asignar nuevo plan"}</DialogTitle>
            <DialogDescription>
              Asigna una App con su plan, ciclo y precio negociado para este cliente.
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            clientId={client.id}
            initial={planDlg.initial}
            onSubmit={(s) => {
              if (planDlg.initial) {
                updateSubscription(s.id, s);
                toast({ title: "Plan actualizado", description: s.id });
              } else {
                addSubscription(s);
                toast({ title: "Plan asignado", description: `${client.tradeName}` });
              }
              setPlanDlg({ open: false });
            }}
            onCancel={() => setPlanDlg({ open: false })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={packDlg.open} onOpenChange={(o) => !o && setPackDlg({ open: false })}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{packDlg.initial ? "Editar pack" : "Nuevo pack extra"}</DialogTitle>
            <DialogDescription>
              Recursos adicionales contratados por encima del plan base.
            </DialogDescription>
          </DialogHeader>
          <ExtraPackForm
            availableApps={availableApps}
            initial={packDlg.initial}
            onSubmit={(data) => {
              if (packDlg.initial) {
                updateExtraPack(packDlg.initial.id, data);
                toast({ title: "Pack actualizado", description: data.name });
              } else {
                addExtraPack({
                  ...data,
                  id: `PKE-${Date.now().toString().slice(-5)}`,
                  clientId: client.id,
                });
                toast({ title: "Pack creado", description: data.name });
              }
              setPackDlg({ open: false });
            }}
            onCancel={() => setPackDlg({ open: false })}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={deleteTitle}
        itemName={deleteTargetName}
        onConfirm={confirmDelete}
      />
    </>
  );
}

/* ───── Subcomponentes ───── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function CardGrid({ children, empty }: { children?: React.ReactNode; empty: string }) {
  const arr = Array.isArray(children) ? children : children ? [children] : [];
  if (arr.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-14 text-center text-sm text-muted-foreground">
          {empty}
        </CardContent>
      </Card>
    );
  }
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function ItemActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit} aria-label="Editar">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={onDelete}
        aria-label="Eliminar"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function ContactoCard({
  name,
  role,
  email,
  phone,
  country,
  onEdit,
  onDelete,
}: {
  name: string;
  role: string;
  email: string;
  phone: string;
  country: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="space-y-1.5 border-t border-border pt-3 text-xs">
          <Row icon={<Mail className="h-3.5 w-3.5" />} text={email} />
          {phone && <Row icon={<Phone className="h-3.5 w-3.5" />} text={phone} />}
          <Row icon={<MapPin className="h-3.5 w-3.5" />} text={country} />
        </div>
      </CardContent>
    </Card>
  );
}

function UsuarioCard({
  user,
  onEdit,
  onDelete,
}: {
  user: ClientUser;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const statusTone: Record<ClientUserStatus, string> = {
    activo: "bg-success/10 text-success",
    invitado: "bg-info/10 text-info",
    suspendido: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.fullName}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {CLIENT_USER_ROLE_LABEL[user.role]}
              </span>
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", statusTone[user.status])}>
                {CLIENT_USER_STATUS_LABEL[user.status]}
              </span>
            </div>
          </div>
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="space-y-1.5 border-t border-border pt-3 text-xs">
          <Row icon={<Mail className="h-3.5 w-3.5" />} text={user.email} />
          <Row
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            text={`Activo desde ${new Date(user.createdAt).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
          />
          {user.apps.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {user.apps.map((appId) => (
                <AppBadge key={appId} appId={appId} size="sm" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PlanCard({
  appId,
  plan,
  status,
  cycle,
  price,
  seats,
  renewal,
  discount,
  onEdit,
  onDelete,
}: {
  appId: string;
  plan: string;
  status: string;
  cycle: string;
  price: string;
  seats: number;
  renewal: string;
  discount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <AppBadge appId={appId as never} size="sm" />
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-semibold">{plan}</p>
            {discount > 0 && (
              <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
                −{discount}%
              </span>
            )}
          </div>
          <div className="mt-1">
            <SubscriptionStatusBadge status={status as never} />
          </div>
        </div>
        <div className="flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-lg font-bold tabular-nums">{price}</p>
            <p className="text-[10px] text-muted-foreground">
              /{cycle === "mensual" ? "mes" : "año"}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="flex items-center justify-end gap-1">
              <Users className="h-3 w-3" /> {seats}
            </p>
            <p className="mt-0.5 flex items-center justify-end gap-1">
              <CalendarDays className="h-3 w-3" /> {renewal}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PackCard({
  pack,
  onEdit,
  onDelete,
}: {
  pack: ExtraPack;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const cycleLabel =
    pack.billingCycle === "mensual" ? "/mes" : pack.billingCycle === "anual" ? "/año" : " único";
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <AppBadge appId={pack.appId as never} size="sm" />
          <ItemActions onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div>
          <p className="text-sm font-semibold">{pack.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              {EXTRA_PACK_KIND_LABEL[pack.kind]}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {pack.quantity} {pack.unit}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(pack.price, pack.currency)}</p>
            <p className="text-[10px] text-muted-foreground">{cycleLabel}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="flex items-center justify-end gap-1">
              <CalendarDays className="h-3 w-3" />
              Desde{" "}
              {new Date(pack.startDate).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        {pack.notes && (
          <p className="border-t border-border pt-2 text-xs italic text-muted-foreground">{pack.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>{icon}</span>
      <span className="truncate text-foreground">{text}</span>
    </div>
  );
}
