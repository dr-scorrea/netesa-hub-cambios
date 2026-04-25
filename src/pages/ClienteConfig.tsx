import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { useClients } from "@/context/ClientsContext";
import { COUNTRY_LABEL } from "@/data/clients";
import { PLANS, formatCurrency } from "@/data/crm";
import { AppBadge } from "@/components/shared/AppBadge";
import { SubscriptionStatusBadge } from "@/components/clients/SubscriptionStatusBadge";
import { cn } from "@/lib/utils";

type SectionKey = "usuarios" | "contactos" | "planes" | "extras";

const SECTIONS: {
  key: SectionKey;
  label: string;
  icon: typeof Users;
  count?: (ctx: { subs: number }) => number;
}[] = [
  { key: "contactos", label: "Contactos", icon: Contact },
  { key: "usuarios", label: "Usuarios", icon: Users },
  { key: "planes", label: "Planes", icon: CalendarRange, count: (c) => c.subs },
  { key: "extras", label: "Pack Extra", icon: Package },
];

export default function ClienteConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, subscriptions } = useClients();
  const [section, setSection] = useState<SectionKey>("contactos");

  const client = useMemo(() => clients.find((c) => c.id === id), [clients, id]);
  const clientSubs = useMemo(
    () => (client ? subscriptions.filter((s) => s.clientId === client.id) : []),
    [subscriptions, client],
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

      {/* Banner del cliente */}
      <Card className="mb-4 overflow-hidden border-l-4 border-l-primary bg-gradient-mesh">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <Field label="Razón social" value={client.legalName} />
          <Field label="RUC / Tax ID" value={client.taxId} />
          <Field label="Industria" value={client.industry} />
        </CardContent>
      </Card>

      {/* Submenú: pills horizontales */}
      <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.key;
          const count = s.count?.({ subs: clientSubs.length });
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
              {typeof count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar: búsqueda + nuevo */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Buscar en ${SECTIONS.find((s) => s.key === section)?.label}…`}
            className="pl-9"
          />
        </div>
        <Button
          size="sm"
          className="shadow-glow"
          onClick={() => {
            if (section === "contactos") {
              navigate(`/clientes/${client.id}/contactos/nuevo`);
            }
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo
        </Button>
      </div>

      {/* Listados como cards */}
      {section === "contactos" && (
        <CardGrid empty="No hay contactos registrados.">
          <ContactoCard
            name={client.contactName}
            role="Contacto principal"
            email={client.contactEmail}
            phone={client.contactPhone}
            country={COUNTRY_LABEL[client.country]}
            onEdit={() =>
              navigate(`/clientes/${client.id}/contactos/main/editar`)
            }
          />
        </CardGrid>
      )}

      {section === "usuarios" && (
        <CardGrid empty="No hay usuarios registrados.">
          <UsuarioCard
            name={client.contactName}
            email={client.contactEmail}
            role="Administrador"
            createdAt={client.createdAt}
          />
        </CardGrid>
      )}

      {section === "planes" && (
        <CardGrid empty="Este cliente todavía no tiene planes asignados.">
          {clientSubs.map((s) => {
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
              />
            );
          })}
        </CardGrid>
      )}

      {section === "extras" && (
        <CardGrid empty="Sin packs extra contratados." />
      )}
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

function CardGrid({
  children,
  empty,
}: {
  children?: React.ReactNode;
  empty: string;
}) {
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
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

function ItemActions({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={onEdit}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive"
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
}: {
  name: string;
  role: string;
  email: string;
  phone: string;
  country: string;
  onEdit?: () => void;
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
          <ItemActions onEdit={onEdit} />
        </div>
        <div className="space-y-1.5 border-t border-border pt-3 text-xs">
          <Row icon={<Mail className="h-3.5 w-3.5" />} text={email} />
          <Row icon={<Phone className="h-3.5 w-3.5" />} text={phone} />
          <Row icon={<MapPin className="h-3.5 w-3.5" />} text={country} />
        </div>
      </CardContent>
    </Card>
  );
}

function UsuarioCard({
  name,
  email,
  role,
  createdAt,
}: {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}) {
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <span className="mt-0.5 inline-flex items-center rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
              {role}
            </span>
          </div>
          <ItemActions />
        </div>
        <div className="space-y-1.5 border-t border-border pt-3 text-xs">
          <Row icon={<Mail className="h-3.5 w-3.5" />} text={email} />
          <Row
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            text={`Activo desde ${new Date(createdAt).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`}
          />
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
}: {
  appId: string;
  plan: string;
  status: string;
  cycle: string;
  price: string;
  seats: number;
  renewal: string;
  discount: number;
}) {
  return (
    <Card className="transition-base hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <AppBadge appId={appId as never} size="sm" />
          <ItemActions />
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

function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>{icon}</span>
      <span className="truncate text-foreground">{text}</span>
    </div>
  );
}
