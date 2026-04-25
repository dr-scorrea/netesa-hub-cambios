export type FacturaEstado = "extraccion" | "revision" | "pendiente" | "aprobada" | "pagada" | "rechazada";

export const FACTURA_ESTADO_LABEL: Record<FacturaEstado, string> = {
  extraccion: "Extrayendo IA",
  revision: "Por revisar",
  pendiente: "Pendiente aprobación",
  aprobada: "Aprobada",
  pagada: "Pagada",
  rechazada: "Rechazada",
};

export type Moneda = "PEN" | "USD";

export type Factura = {
  id: string;
  proveedor: string;
  ruc: string;
  numDocumento: string;
  fechaEmision: string; // ISO date
  moneda: Moneda;
  subtotal: number;
  igv: number;
  total: number;
  categoria: string;
  estado: FacturaEstado;
  archivoNombre: string;
  leidoPorIA: boolean;
  cargadoEn: string;
  notas?: string;
};

const PROVEEDORES = [
  { nombre: "Servicios Cloud Perú SAC", ruc: "20512345678", categoria: "Infraestructura" },
  { nombre: "Estudio Contable Vargas", ruc: "20487654321", categoria: "Servicios profesionales" },
  { nombre: "Suministros Lima EIRL", ruc: "20598765432", categoria: "Suministros oficina" },
  { nombre: "Marketing Digital Andes", ruc: "20611223344", categoria: "Marketing" },
  { nombre: "Telefónica del Perú", ruc: "20100017491", categoria: "Telecomunicaciones" },
  { nombre: "Software Licenses Inc", ruc: "20655443322", categoria: "Software" },
];

export const CATEGORIAS = [
  "Infraestructura",
  "Software",
  "Marketing",
  "Servicios profesionales",
  "Suministros oficina",
  "Telecomunicaciones",
  "Otros",
];

export const FACTURAS_SEED: Factura[] = [
  {
    id: "FAC-001",
    proveedor: "Servicios Cloud Perú SAC",
    ruc: "20512345678",
    numDocumento: "F001-002341",
    fechaEmision: "2025-04-02",
    moneda: "PEN",
    subtotal: 4237.29,
    igv: 762.71,
    total: 5000.0,
    categoria: "Infraestructura",
    estado: "aprobada",
    archivoNombre: "factura_cloud_abril.pdf",
    leidoPorIA: true,
    cargadoEn: "2025-04-03T10:12:00Z",
  },
  {
    id: "FAC-002",
    proveedor: "Estudio Contable Vargas",
    ruc: "20487654321",
    numDocumento: "E001-000891",
    fechaEmision: "2025-04-05",
    moneda: "PEN",
    subtotal: 1525.42,
    igv: 274.58,
    total: 1800.0,
    categoria: "Servicios profesionales",
    estado: "pendiente",
    archivoNombre: "honorarios_contables_abr.pdf",
    leidoPorIA: true,
    cargadoEn: "2025-04-06T09:30:00Z",
  },
  {
    id: "FAC-003",
    proveedor: "Suministros Lima EIRL",
    ruc: "20598765432",
    numDocumento: "B001-014522",
    fechaEmision: "2025-04-10",
    moneda: "PEN",
    subtotal: 322.03,
    igv: 57.97,
    total: 380.0,
    categoria: "Suministros oficina",
    estado: "pagada",
    archivoNombre: "boleta_suministros.jpg",
    leidoPorIA: true,
    cargadoEn: "2025-04-11T14:05:00Z",
  },
  {
    id: "FAC-004",
    proveedor: "Marketing Digital Andes",
    ruc: "20611223344",
    numDocumento: "F002-003120",
    fechaEmision: "2025-04-12",
    moneda: "USD",
    subtotal: 1271.19,
    igv: 228.81,
    total: 1500.0,
    categoria: "Marketing",
    estado: "revision",
    archivoNombre: "campania_q2_marketing.pdf",
    leidoPorIA: true,
    cargadoEn: "2025-04-15T16:45:00Z",
    notas: "Verificar tipo de cambio aplicado",
  },
];

/**
 * Mock OCR extraction. Returns realistic-looking values based on a random
 * provider, with small chance of partial failure for fallback UX.
 */
export function simulateOCR(file: File): Promise<{
  ok: boolean;
  data: Partial<Factura>;
  fallidos: string[];
}> {
  const delay = 1500 + Math.random() * 1500;
  return new Promise((resolve) => {
    setTimeout(() => {
      const prov = PROVEEDORES[Math.floor(Math.random() * PROVEEDORES.length)];
      const subtotal = Math.round((200 + Math.random() * 4800) * 100) / 100;
      const igv = Math.round(subtotal * 0.18 * 100) / 100;
      const total = Math.round((subtotal + igv) * 100) / 100;

      // Simulate occasional partial failures
      const failureRoll = Math.random();
      const fallidos: string[] = [];
      const data: Partial<Factura> = {
        proveedor: prov.nombre,
        ruc: prov.ruc,
        numDocumento: `F00${1 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
        fechaEmision: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().slice(0, 10),
        moneda: "PEN",
        subtotal,
        igv,
        total,
        categoria: prov.categoria,
        archivoNombre: file.name,
        leidoPorIA: true,
      };

      if (failureRoll < 0.15) {
        // partial failure: drop fechaEmision
        delete data.fechaEmision;
        fallidos.push("fechaEmision");
      }
      if (failureRoll < 0.07) {
        delete data.numDocumento;
        fallidos.push("numDocumento");
      }

      resolve({
        ok: fallidos.length === 0,
        data,
        fallidos,
      });
    }, delay);
  });
}
