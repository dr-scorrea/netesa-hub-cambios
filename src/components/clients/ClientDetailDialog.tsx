import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  Briefcase,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Package,
  Users,
} from "lucide-react";
import { AppBadge } from "@/components/shared/AppBadge";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { ClientForm } from "./ClientForm";
import { SubscriptionForm } from "./SubscriptionForm";
import { useClients } from "@/context/ClientsContext";
import { COUNTRY_LABEL, type Client, type Subscription } from "@/data/clients";
import { PLANS, formatCurrency } from "@/data/crm";
import { toast } from "@/hooks/use-toast";

export function ClientDetailDialog({
  client,
  open,
  onOpenChange,
}: {
  client: Client | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { subscriptions, addSubscription, updateSubscription, removeSubscription, updateClient } = useClients();
  const [tab, setTab] = useState<"info" | "subs" | "edit">("subs");
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [showSubForm, setShowSubForm] = useState(false);

  const clientSubs = useMemo(
    () => (client ? subscriptions.filter((s) => s.clientId === client.id) : []),
    [subscriptions, client],
  );

  const monthly = useMemo(() => {
    const groups: Record<string, number> = {};
    clientSubs
      .filter((s) => s.status === "activa" || s.status === "trial")
      .forEach((s) => {
        const v = s.billingCycle === "anual" ? s.negotiatedPrice / 12 : s.negotiatedPrice;
        groups[s.currency] = (groups[s.currency] ?? 0) + v;
      });
    return groups;
  }, [clientSubs]);

  if (!client) return null;

  const handleSubSave = (s: Subscription) => {
    if (editingSub) {
      updateSubscription(s.id, s);
      toast({ title: "Suscripción actualizada", description: s.id });
    } else {
      addSubscription(s);
      toast({ title: "Suscripción creada", description: `${client.tradeName} ya tiene acceso al plan.` });
    }
    setShowSubForm(false);
    setEditingSub(null);
  };

  const handleSubRemove = (s: Subscription) => {
    removeSubscription(s.id);
    toast({ title: "Suscripción eliminada", description: s.id, variant: "destructive" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Building2 className="h-4 w-4" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate">{client.tradeName}</span>
              <span className="text-xs font-normal text-muted-foreground">{client.legalName}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {client.id} · {COUNTRY_LABEL[client.country]} · {client.industry}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subs">
              Suscripciones <span className="ml-1.5 text-xs text-muted-foreground">({clientSubs.length})</span>
            </TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="edit">Editar</TabsTrigger>
          </TabsList>

          <TabsContent value="subs" className="mt-4 space-y-3">
            {Object.keys(monthly).length > 0 && (
              <Card className="bg-gradient-mesh">
                <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Recurrente mensualizado
                    </p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                      {Object.entries(monthly).map(([cur, val]) => (
                        <span key={cur} className="text-xl font-bold tabular-nums">
                          {formatCurrency(val, cur as Subscription["currency"])}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Apps activas</p>
                    <p className="text-xl font-bold">
                      {clientSubs.filter((s) => s.status === "activa" || s.status === "trial").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {showSubForm || editingSub ? (
              <Card className="border-primary/30">
                <CardContent className="p-4">
                  <h4 className="mb-3 text-sm font-semibold">
                    {editingSub ? "Editar suscripción" : "Nueva suscripción"}
                  </h4>
                  <SubscriptionForm
                    clientId={client.id}
                    initial={editingSub ?? undefined}
                    onSubmit={handleSubSave}
                    onCancel={() => {
                      setShowSubForm(false);
                      setEditingSub(null);
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setShowSubForm(true)}
                variant="outline"
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4" />
                Asignar nueva suscripción
              </Button>
            )}

            {clientSubs.length === 0 && !showSubForm ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Este cliente todavía no tiene suscripciones asignadas.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {clientSubs.map((s) => {
                  const plan = PLANS.find((p) => p.id === s.planId);
                  return (
                    <Card key={s.id} className="transition-base hover:shadow-md">
                      <CardContent className="flex flex-wrap items-start gap-3 p-3">
                        <AppBadge appId={s.appId} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{plan?.name ?? s.planId}</span>
                            <SubscriptionStatusBadge status={s.status} />
                            {s.discountPct > 0 && (
                              <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
                                −{s.discountPct}%
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {s.seatsAssigned} usuarios
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              Renueva {new Date(s.renewalDate).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                            </span>
                            <span>{s.billingCycle === "mensual" ? "Mensual" : "Anual"}</span>
                          </div>
                          {s.notes && (
                            <p className="mt-1 text-xs italic text-muted-foreground">{s.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums">
                            {formatCurrency(s.negotiatedPrice, s.currency)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            /{s.billingCycle === "mensual" ? "mes" : "año"}
                          </p>
                          <div className="mt-1 flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setEditingSub(s)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleSubRemove(s)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-3">
            <InfoRow icon={<User className="h-4 w-4" />} label="Contacto" value={client.contactName} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={client.contactEmail} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={client.contactPhone} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="País" value={COUNTRY_LABEL[client.country]} />
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Industria" value={client.industry} />
            <InfoRow icon={<Package className="h-4 w-4" />} label="RUC / Tax ID" value={client.taxId} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Account manager" value={client.accountManager} />
            <InfoRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Cliente desde"
              value={new Date(client.createdAt).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <ClientForm
              initial={client}
              onSubmit={(c) => {
                updateClient(client.id, c);
                toast({ title: "Cliente actualizado", description: c.legalName });
                setTab("info");
              }}
              onCancel={() => setTab("info")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
