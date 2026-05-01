import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Mail, Phone, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Soporte() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Mensaje enviado",
        description: "Nuestro equipo te responderá lo antes posible.",
      });
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <>
      <PageHeader
        title="Contactar soporte"
        description="Habla con el equipo de Netesa."
        icon={<MessageCircle className="h-5 w-5" />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Envíanos un mensaje</CardTitle>
            <CardDescription>Te responderemos en menos de 24 horas hábiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" required placeholder="Tu nombre" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="tu@email.com" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="topic">Tipo de consulta</Label>
                <Select defaultValue="duda">
                  <SelectTrigger id="topic"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duda">Duda general</SelectItem>
                    <SelectItem value="incidencia">Reportar incidencia</SelectItem>
                    <SelectItem value="mejora">Sugerencia / mejora</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" required rows={6} placeholder="Cuéntanos en qué podemos ayudarte..." />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting} className="gap-2">
                  <Send className="h-4 w-4" />
                  {submitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Otros canales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href="mailto:soporte@netesa.com" className="flex items-start gap-3 rounded-md p-2 transition-base hover:bg-accent/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">soporte@netesa.com</p>
              </div>
            </a>
            <a href="tel:+34900000000" className="flex items-start gap-3 rounded-md p-2 transition-base hover:bg-accent/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Teléfono</p>
                <p className="text-xs text-muted-foreground">+34 900 000 000</p>
              </div>
            </a>
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Horario de atención</p>
              <p className="mt-1">Lunes a Viernes · 9:00 - 18:00 (CET)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
