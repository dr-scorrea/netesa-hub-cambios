import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFinanzas } from "@/context/FinanzasContext";
import { type Factura } from "@/data/finanzas";
import { toast } from "@/hooks/use-toast";

export function FacturaUploader({
  onProcessed,
  onReadyToValidate,
}: {
  onProcessed?: (f: Factura) => void;
  onReadyToValidate?: (f: Factura) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { addFactura } = useFinanzas();

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const valid = list.filter((f) => /\.(pdf|jpe?g|png)$/i.test(f.name));
      if (valid.length === 0) {
        toast({
          title: "Formato no soportado",
          description: "Sube imágenes (JPG/PNG) o archivos PDF.",
          variant: "destructive",
        });
        return;
      }

      const PROVEEDORES_DEMO = [
        { nombre: "Servicios Cloud Perú SAC", ruc: "20512345678", categoria: "Infraestructura" },
        { nombre: "Estudio Contable Vargas", ruc: "20487654321", categoria: "Servicios profesionales" },
        { nombre: "Suministros Lima EIRL", ruc: "20598765432", categoria: "Suministros oficina" },
        { nombre: "Marketing Digital Andes", ruc: "20611223344", categoria: "Marketing" },
        { nombre: "Telefónica del Perú", ruc: "20100017491", categoria: "Telecomunicaciones" },
      ];

      for (const file of valid) {
        const tmpId = `FAC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        // Generación instantánea de placeholders (sin IA real, sin delay)
        const prov = PROVEEDORES_DEMO[Math.floor(Math.random() * PROVEEDORES_DEMO.length)];
        const subtotal = Math.round((200 + Math.random() * 4800) * 100) / 100;
        const igv = Math.round(subtotal * 0.18 * 100) / 100;
        const total = Math.round((subtotal + igv) * 100) / 100;

        const placeholder: Factura = {
          id: tmpId,
          proveedor: prov.nombre,
          ruc: prov.ruc,
          numDocumento: `F00${1 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
          fechaEmision: new Date().toISOString().slice(0, 10),
          moneda: "PEN",
          subtotal,
          igv,
          total,
          categoria: prov.categoria,
          estado: "revision",
          archivoNombre: file.name,
          leidoPorIA: true,
          cargadoEn: new Date().toISOString(),
        };
        addFactura(placeholder);

        toast({
          title: "Factura agregada",
          description: `${file.name} — revisa y valida los datos.`,
        });

        if (file === valid[0]) onReadyToValidate?.(placeholder);
      }
    },
    [addFactura, onReadyToValidate],
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-base",
          dragOver
            ? "border-primary bg-accent shadow-glow"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/40",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
          <CloudUpload className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Arrastra tus facturas aquí</h3>
          <p className="text-sm text-muted-foreground">
            PDF, JPG o PNG · La IA extraerá RUC, fecha, subtotal, IGV y total
          </p>
        </div>
        <Button type="button" size="sm" className="mt-1">
          <FileText className="h-4 w-4" />
          Seleccionar archivos
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {processing.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            IA procesando ({processing.length})
          </div>
          {processing.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 rounded-md border border-border bg-background/60 px-3 py-2"
            >
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{it.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(it.size / 1024).toFixed(1)} KB · Extrayendo datos…
                </p>
              </div>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-full animate-pulse bg-gradient-primary" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
