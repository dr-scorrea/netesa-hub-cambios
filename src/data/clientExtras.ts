import type { AppId } from "./apps";
import type { Currency } from "./crm";

/* ───── Contactos adicionales del cliente ───── */
export type ClientContact = {
  id: string;
  clientId: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
};

/* ───── Usuarios del cliente (los que usan las Apps) ───── */
export type ClientUserRole = "owner" | "admin" | "miembro" | "lectura";
export type ClientUserStatus = "activo" | "invitado" | "suspendido";

export type ClientUser = {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  role: ClientUserRole;
  status: ClientUserStatus;
  /** Apps a las que tiene acceso */
  apps: AppId[];
  createdAt: string;
};

export const CLIENT_USER_ROLE_LABEL: Record<ClientUserRole, string> = {
  owner: "Owner",
  admin: "Administrador",
  miembro: "Miembro",
  lectura: "Solo lectura",
};

export const CLIENT_USER_STATUS_LABEL: Record<ClientUserStatus, string> = {
  activo: "Activo",
  invitado: "Invitado",
  suspendido: "Suspendido",
};

/* ───── Packs extra contratados (recursos adicionales) ───── */
export type ExtraPackKind = "usuarios" | "almacenamiento" | "soporte" | "modulo";

export type ExtraPack = {
  id: string;
  clientId: string;
  appId: AppId;
  name: string;
  kind: ExtraPackKind;
  /** Cantidad del recurso (p. ej. 10 usuarios, 50 GB). */
  quantity: number;
  /** Unidad legible (usuarios, GB, horas...). */
  unit: string;
  price: number;
  currency: Currency;
  billingCycle: "mensual" | "anual" | "unico";
  startDate: string;
  notes?: string;
};

export const EXTRA_PACK_KIND_LABEL: Record<ExtraPackKind, string> = {
  usuarios: "Usuarios extra",
  almacenamiento: "Almacenamiento",
  soporte: "Soporte",
  modulo: "Módulo adicional",
};

export const EXTRA_PACK_DEFAULT_UNIT: Record<ExtraPackKind, string> = {
  usuarios: "usuarios",
  almacenamiento: "GB",
  soporte: "horas",
  modulo: "licencia",
};

/* ───── Seeds ───── */

export const CLIENT_CONTACTS_SEED: ClientContact[] = [
  {
    id: "CTC-001",
    clientId: "CLT-001",
    fullName: "Andrea Quispe",
    role: "Finanzas",
    email: "aquispe@ortizlegal.pe",
    phone: "+51 987 222 333",
  },
  {
    id: "CTC-002",
    clientId: "CLT-002",
    fullName: "Pedro Rojas",
    role: "TI",
    email: "projas@caleta.io",
    phone: "+56 9 6677 1122",
  },
];

export const CLIENT_USERS_SEED: ClientUser[] = [
  {
    id: "CUR-001",
    clientId: "CLT-001",
    fullName: "María Fernanda Ortiz",
    email: "mortiz@ortizlegal.pe",
    role: "owner",
    status: "activo",
    apps: ["nodlex", "vacaciones"],
    createdAt: "2024-10-01T10:00:00Z",
  },
  {
    id: "CUR-002",
    clientId: "CLT-001",
    fullName: "Andrea Quispe",
    email: "aquispe@ortizlegal.pe",
    role: "admin",
    status: "activo",
    apps: ["nodlex"],
    createdAt: "2024-10-15T10:00:00Z",
  },
  {
    id: "CUR-003",
    clientId: "CLT-002",
    fullName: "Valentina Ríos",
    email: "vrios@caleta.io",
    role: "owner",
    status: "activo",
    apps: ["nodlex"],
    createdAt: "2024-11-15T10:00:00Z",
  },
];

export const EXTRA_PACKS_SEED: ExtraPack[] = [
  {
    id: "PKE-001",
    clientId: "CLT-001",
    appId: "nodlex",
    name: "Pack 5 usuarios extra",
    kind: "usuarios",
    quantity: 5,
    unit: "usuarios",
    price: 75,
    currency: "PEN",
    billingCycle: "mensual",
    startDate: "2024-12-01",
  },
  {
    id: "PKE-002",
    clientId: "CLT-005",
    appId: "desempeno",
    name: "Almacenamiento 50 GB",
    kind: "almacenamiento",
    quantity: 50,
    unit: "GB",
    price: 49,
    currency: "PEN",
    billingCycle: "mensual",
    startDate: "2025-01-15",
  },
];
