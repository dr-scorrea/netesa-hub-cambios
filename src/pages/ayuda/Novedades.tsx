import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const RELEASES = [
  {
    version: "v1.0.0",
    date: "1 de mayo de 2026",
    tag: "Lanzamiento",
    items: [
      "Lanzamiento oficial del ERP Netesa con módulo CRM Multi-SaaS.",
      "Centro de notificaciones con navegación contextual.",
      "Gestión completa de propuestas comerciales.",
    ],
  },
  {
    version: "v0.9.0",
    date: "Abril 2026",
    tag: "Mejora",
    items: [
      "Mejoras de responsividad en listados y modales.",
      "Modal de confirmación al eliminar items en todos los listados.",
      "Configuración avanzada de clientes (planes, packs y usuarios).",
    ],
  },
  {
    version: "v0.8.0",
    date: "Marzo 2026",
    tag: "Nuevo",
    items: [
      "Módulo de Finanzas con carga de facturas.",
      "Pipeline visual para seguimiento de oportunidades.",
    ],
  },
];

export default function Novedades() {
  return (
    <>
      <PageHeader
        title="Novedades"
        description="Últimas mejoras y cambios del ERP Netesa."
        icon={<Sparkles className="h-5 w-5" />}
      />
      <div className="space-y-4">
        {RELEASES.map((r) => (
          <Card key={r.version}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">{r.version}</CardTitle>
                <Badge variant="secondary">{r.tag}</Badge>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {r.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
