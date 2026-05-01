import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard } from "lucide-react";

const GROUPS = [
  {
    title: "Navegación",
    shortcuts: [
      { keys: ["G", "D"], action: "Ir al Dashboard" },
      { keys: ["G", "L"], action: "Ir a Leads" },
      { keys: ["G", "P"], action: "Ir a Propuestas" },
      { keys: ["G", "C"], action: "Ir a Clientes" },
      { keys: ["G", "F"], action: "Ir a Finanzas" },
    ],
  },
  {
    title: "Acciones rápidas",
    shortcuts: [
      { keys: ["N"], action: "Crear nuevo (en la sección actual)" },
      { keys: ["/"], action: "Enfocar búsqueda" },
      { keys: ["Esc"], action: "Cerrar modal o panel" },
      { keys: ["?"], action: "Mostrar atajos" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Ctrl", "K"], action: "Abrir paleta de comandos" },
      { keys: ["Ctrl", "S"], action: "Guardar formulario" },
      { keys: ["Shift", "N"], action: "Abrir notificaciones" },
    ],
  },
];

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-xs font-mono shadow-sm">
    {children}
  </kbd>
);

export default function Atajos() {
  return (
    <>
      <PageHeader
        title="Atajos de teclado"
        description="Acelera tu trabajo diario en el ERP."
        icon={<Keyboard className="h-5 w-5" />}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <CardHeader>
              <CardTitle className="text-base">{g.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {g.shortcuts.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{s.action}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          <Key>{k}</Key>
                          {idx < s.keys.length - 1 && <span className="text-xs text-muted-foreground">+</span>}
                        </span>
                      ))}
                    </span>
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
