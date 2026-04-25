import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, UserPlus, Pencil } from "lucide-react";
import { useClients } from "@/context/ClientsContext";
import { COUNTRY_LABEL } from "@/data/clients";
import { toast } from "sonner";

type Region = { value: string; label: string; provincias: { value: string; label: string; comunas: string[] }[] };

const REGIONES: Region[] = [
  {
    value: "lima",
    label: "Lima",
    provincias: [
      { value: "lima-prov", label: "Lima", comunas: ["Miraflores", "San Isidro", "Surco", "Barranco"] },
      { value: "callao", label: "Callao", comunas: ["Callao", "Bellavista", "La Perla"] },
    ],
  },
  {
    value: "arequipa",
    label: "Arequipa",
    provincias: [
      { value: "arequipa-prov", label: "Arequipa", comunas: ["Cercado", "Yanahuara", "Cayma"] },
    ],
  },
  {
    value: "cusco",
    label: "Cusco",
    provincias: [
      { value: "cusco-prov", label: "Cusco", comunas: ["Cusco", "San Sebastián", "Wanchaq"] },
    ],
  },
];

export default function ContactoForm() {
  const { id, contactoId } = useParams();
  const navigate = useNavigate();
  const { clients } = useClients();
  const isEdit = Boolean(contactoId);

  const client = useMemo(() => clients.find((c) => c.id === id), [clients, id]);

  const [form, setForm] = useState({
    nombres: "",
    apPaterno: "",
    apMaterno: "",
    email: "",
    telefono: "",
    cargo: "",
    direccion: "",
    region: "",
    provincia: "",
    comuna: "",
  });

  // Si es edición, prellenar con el contacto principal del cliente
  useEffect(() => {
    if (isEdit && client) {
      const [first = "", paterno = "", materno = ""] = client.contactName.split(" ");
      setForm((f) => ({
        ...f,
        nombres: first,
        apPaterno: paterno,
        apMaterno: materno,
        email: client.contactEmail,
        telefono: client.contactPhone,
        cargo: "Contacto principal",
      }));
    }
  }, [isEdit, client]);

  const provincias = REGIONES.find((r) => r.value === form.region)?.provincias ?? [];
  const comunas =
    provincias.find((p) => p.value === form.provincia)?.comunas ?? [];

  if (!client) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Cliente no encontrado.
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    if (!form.nombres.trim() || !form.apPaterno.trim() || !form.email.trim()) {
      toast.error("Completa nombres, apellido paterno y correo");
      return;
    }
    toast.success(isEdit ? "Contacto actualizado" : "Contacto creado");
    navigate(`/clientes/${client.id}/configuracion`);
  };

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Card className="overflow-hidden border-border/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isEdit ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          </div>
          <h1 className="text-base font-semibold text-primary">
            {isEdit ? "Editar Contacto" : "Nuevo Contacto"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/clientes/${client.id}/configuracion`)}
          >
            <X className="h-4 w-4" /> Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} className="shadow-glow">
            <Save className="h-4 w-4" /> Guardar
          </Button>
        </div>
      </div>

      <CardContent className="space-y-5 p-5">
        {/* Banner cliente */}
        <div className="rounded-lg border-l-4 border-l-primary bg-primary/5 px-4 py-3">
          <p className="text-xs leading-relaxed">
            <span className="font-semibold text-primary">Nombre Cliente:</span>{" "}
            <span className="text-foreground">{client.tradeName}</span>
          </p>
          <p className="text-xs leading-relaxed">
            <span className="font-semibold text-primary">Código Cliente:</span>{" "}
            <span className="text-foreground">{client.id}</span>
          </p>
          <p className="text-xs leading-relaxed">
            <span className="font-semibold text-primary">País:</span>{" "}
            <span className="text-foreground">{COUNTRY_LABEL[client.country]}</span>
          </p>
        </div>

        {/* Fila 1: Nombres / Ap. Paterno / Ap. Materno */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nombre(s)" required>
            <Input
              value={form.nombres}
              onChange={(e) => update("nombres", e.target.value)}
              maxLength={80}
            />
          </Field>
          <Field label="Ap. Paterno" required>
            <Input
              value={form.apPaterno}
              onChange={(e) => update("apPaterno", e.target.value)}
              maxLength={60}
            />
          </Field>
          <Field label="Ap. Materno">
            <Input
              value={form.apMaterno}
              onChange={(e) => update("apMaterno", e.target.value)}
              maxLength={60}
            />
          </Field>
        </div>

        {/* Fila 2: Correo / Teléfono */}
        <div className="grid gap-4 sm:grid-cols-[2fr,1fr]">
          <Field label="Correo electrónico" required>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              maxLength={120}
            />
          </Field>
          <Field label="Teléfono">
            <Input
              value={form.telefono}
              onChange={(e) => update("telefono", e.target.value)}
              maxLength={30}
            />
          </Field>
        </div>

        {/* Fila 3: Cargo */}
        <Field label="Cargo">
          <Input
            value={form.cargo}
            onChange={(e) => update("cargo", e.target.value)}
            maxLength={80}
          />
        </Field>

        {/* Fila 4: Dirección */}
        <Field label="Dirección">
          <Input
            value={form.direccion}
            onChange={(e) => update("direccion", e.target.value)}
            maxLength={150}
          />
        </Field>

        {/* Fila 5: Región / Provincia / Comuna */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Región">
            <Select
              value={form.region}
              onValueChange={(v) => {
                update("region", v);
                update("provincia", "");
                update("comuna", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                {REGIONES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Provincia">
            <Select
              value={form.provincia}
              onValueChange={(v) => {
                update("provincia", v);
                update("comuna", "");
              }}
              disabled={!form.region}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                {provincias.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Comuna / Distrito">
            <Select
              value={form.comuna}
              onValueChange={(v) => update("comuna", v)}
              disabled={!form.provincia}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                {comunas.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
