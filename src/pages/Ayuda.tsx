import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Sparkles,
  Keyboard,
  MessageCircle,
  LifeBuoy,
  ArrowRight,
  Mail,
  HelpCircle,
} from "lucide-react";

const SECTIONS = [
  {
    icon: BookOpen,
    title: "Centro de ayuda",
    description: "Guías paso a paso, tutoriales y documentación completa del ERP Netesa.",
    to: "/ayuda/centro",
    cta: "Explorar guías",
  },
  {
    icon: Sparkles,
    title: "Novedades",
    description: "Conoce las últimas mejoras, nuevas funciones y cambios en la plataforma.",
    to: "/ayuda/novedades",
    cta: "Ver novedades",
  },
  {
    icon: Keyboard,
    title: "Atajos de teclado",
    description: "Acelera tu trabajo diario con los atajos disponibles en cada módulo.",
    to: "/ayuda/atajos",
    cta: "Ver atajos",
  },
  {
    icon: MessageCircle,
    title: "Contactar soporte",
    description: "Habla con el equipo de Netesa para resolver dudas o reportar incidencias.",
    to: "/ayuda/soporte",
    cta: "Contactar",
  },
];

export default function Ayuda() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Ayuda y soporte"
        description="Recursos para sacar el máximo partido al ERP Netesa."
        icon={<LifeBuoy className="h-5 w-5" />}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, title, description, to, cta }) => (
          <Card key={to} className="transition-base hover:border-primary/40 hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="mt-1">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate(to)} className="gap-2">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-start gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">¿No encuentras lo que buscas?</p>
              <p className="text-xs text-muted-foreground">Escríbenos y te ayudamos lo antes posible.</p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <a href="mailto:soporte@netesa.com">
              <Mail className="h-4 w-4" />
              soporte@netesa.com
            </a>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
