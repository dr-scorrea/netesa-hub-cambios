import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Construction } from "lucide-react";

const Placeholder = ({ title, description }: { title: string; description: string }) => (
  <>
    <PageHeader title={title} description={description} icon={<Building2 className="h-5 w-5" />} />
    <Card className="border-dashed border-border bg-card/50">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Construction className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold">Próximamente</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Este módulo es parte del roadmap. Estamos enfocados en CRM Multi-SaaS en esta versión.
        </p>
      </CardContent>
    </Card>
  </>
);

export const Configuracion = () => <Placeholder title="Configuración" description="Roles, permisos y catálogos transversales del ERP Netesa." />;
