import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Users, CreditCard, Briefcase, FileText, Settings, Bell } from "lucide-react";
import { useState } from "react";

const TOPICS = [
  { icon: Users, title: "Gestión de Leads", description: "Cómo capturar, calificar y dar seguimiento a leads.", category: "CRM" },
  { icon: FileText, title: "Crear propuestas", description: "Genera propuestas comerciales asociadas a un lead.", category: "CRM" },
  { icon: Briefcase, title: "Clientes y contratos", description: "Administra clientes, contactos y suscripciones.", category: "Clientes" },
  { icon: CreditCard, title: "Finanzas y facturación", description: "Sube facturas, controla cobros y vencimientos.", category: "Finanzas" },
  { icon: Users, title: "Usuarios y roles", description: "Crea usuarios y asigna permisos por módulo.", category: "Administración" },
  { icon: Bell, title: "Notificaciones", description: "Configura alertas del sistema y entiende cada tipo.", category: "Sistema" },
  { icon: Settings, title: "Configuración general", description: "Catálogos transversales y parámetros del ERP.", category: "Sistema" },
];

export default function CentroAyuda() {
  const [q, setQ] = useState("");
  const filtered = TOPICS.filter((t) =>
    `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Centro de ayuda"
        description="Guías y documentación del ERP Netesa."
        icon={<BookOpen className="h-5 w-5" />}
      />
      <div className="relative mb-4 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Busca una guía..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ icon: Icon, title, description, category }) => (
          <Card key={title} className="transition-base hover:border-primary/40">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">{category}</Badge>
                  </div>
                  <CardDescription className="mt-1 text-xs">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3 border-dashed">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No encontramos resultados para "{q}".
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
