import type { AppId } from "./apps";
import type { Currency } from "./crm";

export type SubscriptionStatus = "activa" | "trial" | "pausada" | "cancelada" | "morosa";
export type BillingCycle = "mensual" | "anual";

export type Subscription = {
  id: string;
  clientId: string;
  appId: AppId;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  /** Precio negociado para este cliente (puede diferir del precio de lista) */
  negotiatedPrice: number;
  currency: Currency;
  /** Descuento aplicado vs. precio de lista (%) */
  discountPct: number;
  /** Usuarios asignados al cliente, dentro del límite del plan */
  seatsAssigned: number;
  startDate: string;
  renewalDate: string;
  notes?: string;
};

export type Client = {
  id: string;
  legalName: string;
  tradeName: string;
  taxId: string; // RUC
  country: "PE" | "CL" | "MX" | "CO";
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: "activo" | "trial" | "inactivo";
  createdAt: string;
  accountManager: string;
};

export const COUNTRY_LABEL: Record<Client["country"], string> = {
  PE: "Perú",
  CL: "Chile",
  MX: "México",
  CO: "Colombia",
};

export const CLIENT_STATUS_LABEL: Record<Client["status"], string> = {
  activo: "Activo",
  trial: "En trial",
  inactivo: "Inactivo",
};

export const SUB_STATUS_LABEL: Record<SubscriptionStatus, string> = {
  activa: "Activa",
  trial: "Trial",
  pausada: "Pausada",
  cancelada: "Cancelada",
  morosa: "Morosa",
};

export const CLIENTS_SEED: Client[] = [
  {
    id: "CLT-001",
    legalName: "Estudio Ortiz & Asociados SAC",
    tradeName: "Ortiz Legal",
    taxId: "20512388112",
    country: "PE",
    industry: "Servicios legales",
    contactName: "María Fernanda Ortiz",
    contactEmail: "mortiz@ortizlegal.pe",
    contactPhone: "+51 987 654 321",
    status: "activo",
    createdAt: "2024-09-15T10:00:00Z",
    accountManager: "Lucía Ramírez",
  },
  {
    id: "CLT-002",
    legalName: "Fintech Caleta SpA",
    tradeName: "Caleta",
    taxId: "76.554.221-K",
    country: "CL",
    industry: "Fintech",
    contactName: "Valentina Ríos",
    contactEmail: "vrios@caleta.io",
    contactPhone: "+56 9 4433 2211",
    status: "activo",
    createdAt: "2024-11-02T14:00:00Z",
    accountManager: "Lucía Ramírez",
  },
  {
    id: "CLT-003",
    legalName: "Logística Andina SAC",
    tradeName: "LogAndina",
    taxId: "20567891234",
    country: "PE",
    industry: "Logística",
    contactName: "Roberto Pacheco",
    contactEmail: "rpacheco@logandina.com",
    contactPhone: "+51 911 222 333",
    status: "trial",
    createdAt: "2025-03-12T09:00:00Z",
    accountManager: "Diego Torres",
  },
  {
    id: "CLT-004",
    legalName: "Constructora del Sur SpA",
    tradeName: "Del Sur",
    taxId: "76.998.331-2",
    country: "CL",
    industry: "Construcción",
    contactName: "Patricia Núñez",
    contactEmail: "pnunez@delsur.cl",
    contactPhone: "+56 9 5544 8877",
    status: "activo",
    createdAt: "2024-07-20T11:30:00Z",
    accountManager: "Camila Soto",
  },
  {
    id: "CLT-005",
    legalName: "Retail Express EIRL",
    tradeName: "Retex",
    taxId: "20611445522",
    country: "PE",
    industry: "Retail",
    contactName: "Jorge Salinas",
    contactEmail: "jsalinas@retex.com",
    contactPhone: "+51 998 010 020",
    status: "activo",
    createdAt: "2024-12-01T08:00:00Z",
    accountManager: "Andrés Vega",
  },
  {
    id: "CLT-006",
    legalName: "EduForma SAC",
    tradeName: "EduForma",
    taxId: "20588776655",
    country: "PE",
    industry: "Educación",
    contactName: "Daniela Inca",
    contactEmail: "dinca@eduforma.pe",
    contactPhone: "+51 977 332 110",
    status: "trial",
    createdAt: "2025-04-01T15:00:00Z",
    accountManager: "Lucía Ramírez",
  },
];

const daysFromNow = (d: number) =>
  new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

export const SUBSCRIPTIONS_SEED: Subscription[] = [
  // Ortiz Legal: NodLex Pro + Vacaciones Starter
  {
    id: "SUB-1001",
    clientId: "CLT-001",
    appId: "nodlex",
    planId: "pln-nodlex-pro",
    status: "activa",
    billingCycle: "anual",
    negotiatedPrice: 359,
    currency: "PEN",
    discountPct: 10,
    seatsAssigned: 18,
    startDate: "2024-10-01",
    renewalDate: daysFromNow(45),
  },
  {
    id: "SUB-1002",
    clientId: "CLT-001",
    appId: "vacaciones",
    planId: "pln-vac-starter",
    status: "activa",
    billingCycle: "mensual",
    negotiatedPrice: 79,
    currency: "PEN",
    discountPct: 0,
    seatsAssigned: 14,
    startDate: "2024-11-15",
    renewalDate: daysFromNow(12),
  },
  // Caleta: NodLex Pro
  {
    id: "SUB-1003",
    clientId: "CLT-002",
    appId: "nodlex",
    planId: "pln-nodlex-pro",
    status: "activa",
    billingCycle: "anual",
    negotiatedPrice: 95,
    currency: "USD",
    discountPct: 10,
    seatsAssigned: 12,
    startDate: "2024-11-15",
    renewalDate: daysFromNow(180),
  },
  // LogAndina: trial Vacaciones Team
  {
    id: "SUB-1004",
    clientId: "CLT-003",
    appId: "vacaciones",
    planId: "pln-vac-team",
    status: "trial",
    billingCycle: "mensual",
    negotiatedPrice: 199,
    currency: "PEN",
    discountPct: 0,
    seatsAssigned: 75,
    startDate: "2025-03-12",
    renewalDate: daysFromNow(8),
    notes: "Trial extendido a 30 días",
  },
  // Del Sur: Incidentes Pro
  {
    id: "SUB-1005",
    clientId: "CLT-004",
    appId: "incidentes",
    planId: "pln-inc-pro",
    status: "activa",
    billingCycle: "anual",
    negotiatedPrice: 71,
    currency: "USD",
    discountPct: 10,
    seatsAssigned: 88,
    startDate: "2024-08-01",
    renewalDate: daysFromNow(95),
  },
  // Retex: Desempeño Pro + Vacaciones Team
  {
    id: "SUB-1006",
    clientId: "CLT-005",
    appId: "desempeno",
    planId: "pln-des-pro",
    status: "activa",
    billingCycle: "mensual",
    negotiatedPrice: 249,
    currency: "PEN",
    discountPct: 0,
    seatsAssigned: 65,
    startDate: "2024-12-15",
    renewalDate: daysFromNow(22),
  },
  {
    id: "SUB-1007",
    clientId: "CLT-005",
    appId: "vacaciones",
    planId: "pln-vac-team",
    status: "morosa",
    billingCycle: "mensual",
    negotiatedPrice: 199,
    currency: "PEN",
    discountPct: 0,
    seatsAssigned: 70,
    startDate: "2025-01-10",
    renewalDate: daysFromNow(-6),
    notes: "Pago atrasado 6 días",
  },
  // EduForma: trial Desempeño Pro
  {
    id: "SUB-1008",
    clientId: "CLT-006",
    appId: "desempeno",
    planId: "pln-des-pro",
    status: "trial",
    billingCycle: "mensual",
    negotiatedPrice: 224,
    currency: "PEN",
    discountPct: 10,
    seatsAssigned: 100,
    startDate: "2025-04-01",
    renewalDate: daysFromNow(15),
  },
];
