import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const apps = [
  { name: "NodLex", color: "bg-app-nodlex" },
  { name: "Vacaciones", color: "bg-app-vacaciones" },
  { name: "Incidentes", color: "bg-app-incidentes" },
  { name: "Desempeño", color: "bg-app-desempeno" },
  { name: "DNC", color: "bg-app-dnc" },
  { name: "Finanzas", color: "bg-app-finanzas" },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <section className="container mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Proyecto inicializado
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          ERP Netesa
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Ecosistema multi-SaaS unificado: CRM, planes, leads y facturación interna en una sola plataforma.
        </p>

        <Card className="mt-12 w-full max-w-3xl border-border/60 shadow-sm animate-scale-in">
          <CardHeader>
            <CardTitle>Apps del ecosistema</CardTitle>
            <CardDescription>Tokens de color listos para cada producto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {apps.map((app) => (
                <div
                  key={app.name}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3"
                >
                  <span className={`h-8 w-8 rounded-md ${app.color}`} />
                  <span className="text-sm font-medium text-card-foreground">{app.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg">Empezar a construir</Button>
          <Button size="lg" variant="outline">
            Ver documentación
          </Button>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          Placeholder temporal — listo para que definas tus pantallas.
        </p>
      </section>
    </main>
  );
};

export default Index;
