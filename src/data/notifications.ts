export type NotifType = "lead" | "propuesta" | "factura" | "incidente" | "sistema";

export type Notification = {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  /** Ruta interna a la que navegar al hacer click. Si no existe, no es navegable. */
  to?: string;
};

export const NOTIFICATIONS_SEED: Notification[] = [
  {
    id: "n1",
    type: "propuesta",
    title: "Propuesta aceptada",
    description: "Valentina Ríos (Fintech Caleta) aceptó la propuesta PR-2002.",
    time: "Hace 5 min",
    read: false,
    to: "/propuestas",
  },
  {
    id: "n2",
    type: "lead",
    title: "Nuevo lead asignado",
    description: "Jorge Salinas (Retail Express) fue asignado a tu pipeline.",
    time: "Hace 1 h",
    read: false,
    to: "/leads",
  },
  {
    id: "n3",
    type: "factura",
    title: "Factura pagada",
    description: "Factura F-1043 de Logística Andina marcada como pagada.",
    time: "Hace 3 h",
    read: false,
    to: "/finanzas",
  },
  {
    id: "n4",
    type: "incidente",
    title: "Propuesta por vencer",
    description: "PR-2001 vence en 2 días sin respuesta del cliente.",
    time: "Ayer",
    read: true,
    to: "/propuestas",
  },
  {
    id: "n5",
    type: "sistema",
    title: "Nuevo usuario creado",
    description: "Andrés Vega fue agregado al equipo Comercial.",
    time: "Hace 2 días",
    read: true,
    to: "/usuarios",
  },
];
