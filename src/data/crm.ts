import type { AppId } from "./apps";

export type Currency = "PEN" | "USD" | "CLP";

export type Plan = {
  id: string;
  appId: AppId;
  name: string;
  tagline: string;
  prices: Record<Currency, number>;
  billing: "mensual" | "anual";
  maxUsers: number | "Ilimitado";
  storageGB: number;
  features: string[];
  highlight?: boolean;
};

export type LeadStatus = "nuevo" | "contactado" | "diagnostico" | "propuesta" | "ganado" | "perdido";

export type Lead = {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  appId: AppId;
  status: LeadStatus;
  priority: "alta" | "media" | "baja";
  source: string;
  estimatedValue: number;
  currency: Currency;
  notes: string;
  createdAt: string;
  owner: string;
};

export type Proposal = {
  id: string;
  leadId: string;
  planId: string;
  appId: AppId;
  amount: number;
  currency: Currency;
  status: "borrador" | "enviada" | "aceptada" | "rechazada";
  createdAt: string;
  validUntil: string;
};

export const PLANS: Plan[] = [
  // NodLex
  {
    id: "pln-nodlex-basic",
    appId: "nodlex",
    name: "NodLex Basic",
    tagline: "Para estudios pequeños que recién organizan su operación.",
    prices: { PEN: 149, USD: 39, CLP: 36000 },
    billing: "mensual",
    maxUsers: 5,
    storageGB: 10,
    features: ["Gestión de Casos", "Oponentes y Testigos", "Calendario de Audiencias", "Soporte por email"],
  },
  {
    id: "pln-nodlex-pro",
    appId: "nodlex",
    name: "NodLex Pro",
    tagline: "Para estudios en crecimiento con múltiples abogados.",
    prices: { PEN: 399, USD: 105, CLP: 95000 },
    billing: "mensual",
    maxUsers: 25,
    storageGB: 100,
    features: ["Todo de Basic", "Mesa de Partes", "Registro de horas", "Reportes avanzados", "Soporte prioritario"],
    highlight: true,
  },
  {
    id: "pln-nodlex-enterprise",
    appId: "nodlex",
    name: "NodLex Enterprise",
    tagline: "Para grandes firmas con necesidades a medida.",
    prices: { PEN: 999, USD: 269, CLP: 245000 },
    billing: "mensual",
    maxUsers: "Ilimitado",
    storageGB: 1000,
    features: ["Todo de Pro", "API y webhooks", "SSO corporativo", "Account manager dedicado"],
  },
  // Vacaciones
  {
    id: "pln-vac-starter",
    appId: "vacaciones",
    name: "Vacaciones Starter",
    tagline: "Aprobaciones de ausencias para equipos pequeños.",
    prices: { PEN: 79, USD: 21, CLP: 19000 },
    billing: "mensual",
    maxUsers: 15,
    storageGB: 5,
    features: ["Solicitudes y aprobaciones", "Calendario de equipo", "Notificaciones email"],
  },
  {
    id: "pln-vac-team",
    appId: "vacaciones",
    name: "Vacaciones Team",
    tagline: "Operación profesional de RRHH.",
    prices: { PEN: 199, USD: 52, CLP: 47500 },
    billing: "mensual",
    maxUsers: 75,
    storageGB: 25,
    features: ["Todo de Starter", "Políticas por país", "Reportes de balance", "Integración Slack"],
    highlight: true,
  },
  // Incidentes
  {
    id: "pln-inc-basic",
    appId: "incidentes",
    name: "Incidentes Basic",
    tagline: "Tickets y SST para equipos en planta.",
    prices: { PEN: 119, USD: 32, CLP: 28500 },
    billing: "mensual",
    maxUsers: 20,
    storageGB: 15,
    features: ["Registro de tickets", "Categorización SST", "Adjuntos y fotos"],
  },
  {
    id: "pln-inc-pro",
    appId: "incidentes",
    name: "Incidentes Pro",
    tagline: "Cumplimiento y trazabilidad completa.",
    prices: { PEN: 299, USD: 79, CLP: 71500 },
    billing: "mensual",
    maxUsers: 100,
    storageGB: 75,
    features: ["Todo de Basic", "SLA y escalamiento", "Dashboards", "Auditoría completa"],
    highlight: true,
  },
  // Desempeño
  {
    id: "pln-des-basic",
    appId: "desempeno",
    name: "Desempeño Basic",
    tagline: "Evaluaciones simples y feedback 1:1.",
    prices: { PEN: 99, USD: 26, CLP: 23500 },
    billing: "mensual",
    maxUsers: 25,
    storageGB: 10,
    features: ["Evaluaciones por ciclo", "Feedback continuo", "Plantillas básicas"],
  },
  {
    id: "pln-des-pro",
    appId: "desempeno",
    name: "Desempeño Pro",
    tagline: "OKRs, KPIs y 360°.",
    prices: { PEN: 249, USD: 65, CLP: 59500 },
    billing: "mensual",
    maxUsers: 100,
    storageGB: 50,
    features: ["Todo de Basic", "Evaluación 360°", "OKRs y KPIs", "Reportes de talento"],
    highlight: true,
  },
];

const owners = ["Lucía Ramírez", "Diego Torres", "Camila Soto", "Andrés Vega"];
const sources = ["Web", "LinkedIn", "Referido", "Evento", "Inbound email"];

const baseLeads: Omit<Lead, "id" | "createdAt">[] = [
  {
    fullName: "María Fernanda Ortiz",
    company: "Estudio Ortiz & Asociados",
    email: "mortiz@ortizlegal.pe",
    phone: "+51 987 654 321",
    appId: "nodlex",
    status: "propuesta",
    priority: "alta",
    source: "Referido",
    estimatedValue: 4800,
    currency: "PEN",
    notes: "Estudio con 18 abogados, evaluando reemplazar Excel y Drive. Pidió demo Pro.",
    owner: "Lucía Ramírez",
  },
  {
    fullName: "Roberto Pacheco",
    company: "Logística Andina SAC",
    email: "rpacheco@logandina.com",
    phone: "+51 911 222 333",
    appId: "vacaciones",
    status: "diagnostico",
    priority: "media",
    source: "Web",
    estimatedValue: 2400,
    currency: "PEN",
    notes: "85 colaboradores en 3 sedes. Necesita aprobaciones por jerarquía.",
    owner: "Diego Torres",
  },
  {
    fullName: "Patricia Núñez",
    company: "Constructora del Sur",
    email: "pnunez@delsur.cl",
    phone: "+56 9 5544 8877",
    appId: "incidentes",
    status: "contactado",
    priority: "alta",
    source: "LinkedIn",
    estimatedValue: 950,
    currency: "USD",
    notes: "Obras en regiones, busca SST con fotos georreferenciadas.",
    owner: "Camila Soto",
  },
  {
    fullName: "Jorge Salinas",
    company: "Retail Express",
    email: "jsalinas@retex.com",
    phone: "+51 998 010 020",
    appId: "desempeno",
    status: "nuevo",
    priority: "media",
    source: "Evento",
    estimatedValue: 3200,
    currency: "PEN",
    notes: "Recién terminó proceso de evaluación manual. Quiere automatizar el próximo ciclo.",
    owner: "Andrés Vega",
  },
  {
    fullName: "Valentina Ríos",
    company: "Fintech Caleta",
    email: "vrios@caleta.io",
    phone: "+56 9 4433 2211",
    appId: "nodlex",
    status: "ganado",
    priority: "alta",
    source: "Inbound email",
    estimatedValue: 2700,
    currency: "USD",
    notes: "Cerrado plan Pro anual. Onboarding en curso.",
    owner: "Lucía Ramírez",
  },
  {
    fullName: "Hugo Mendoza",
    company: "Servicios Industriales SRL",
    email: "hmendoza@siservi.pe",
    phone: "+51 922 113 445",
    appId: "incidentes",
    status: "propuesta",
    priority: "media",
    source: "Web",
    estimatedValue: 3600,
    currency: "PEN",
    notes: "Cotización Pro. Necesitan integración con su ERP de planillas.",
    owner: "Diego Torres",
  },
  {
    fullName: "Sofía Cárdenas",
    company: "Boutique Legal Cárdenas",
    email: "scardenas@bclegal.pe",
    phone: "+51 933 765 121",
    appId: "nodlex",
    status: "contactado",
    priority: "baja",
    source: "Referido",
    estimatedValue: 1800,
    currency: "PEN",
    notes: "Estudio chico (4 personas). Probablemente Basic.",
    owner: "Camila Soto",
  },
  {
    fullName: "Esteban Quiroga",
    company: "Agropex",
    email: "equiroga@agropex.cl",
    phone: "+56 9 7766 1199",
    appId: "vacaciones",
    status: "perdido",
    priority: "media",
    source: "LinkedIn",
    estimatedValue: 1500,
    currency: "USD",
    notes: "Eligió competidor por integración nativa con su HRIS.",
    owner: "Andrés Vega",
  },
  {
    fullName: "Daniela Inca",
    company: "EduForma",
    email: "dinca@eduforma.pe",
    phone: "+51 977 332 110",
    appId: "desempeno",
    status: "diagnostico",
    priority: "alta",
    source: "Web",
    estimatedValue: 4100,
    currency: "PEN",
    notes: "120 docentes. Necesitan 360° y OKRs.",
    owner: "Lucía Ramírez",
  },
  {
    fullName: "Marco Linares",
    company: "Hotelería Pacífico",
    email: "mlinares@pacifico.pe",
    phone: "+51 944 010 909",
    appId: "vacaciones",
    status: "propuesta",
    priority: "alta",
    source: "Inbound email",
    estimatedValue: 2900,
    currency: "PEN",
    notes: "Plan Team con políticas por sede.",
    owner: "Diego Torres",
  },
];

const today = new Date();
export const LEADS: Lead[] = baseLeads.map((l, i) => ({
  ...l,
  id: `LD-${String(1000 + i)}`,
  createdAt: new Date(today.getTime() - (i + 1) * 86400000 * 2).toISOString(),
}));

export const PROPOSALS: Proposal[] = [
  {
    id: "PR-2001",
    leadId: "LD-1000",
    planId: "pln-nodlex-pro",
    appId: "nodlex",
    amount: 4800,
    currency: "PEN",
    status: "enviada",
    createdAt: new Date(today.getTime() - 3 * 86400000).toISOString(),
    validUntil: new Date(today.getTime() + 12 * 86400000).toISOString(),
  },
  {
    id: "PR-2002",
    leadId: "LD-1004",
    planId: "pln-nodlex-pro",
    appId: "nodlex",
    amount: 2700,
    currency: "USD",
    status: "aceptada",
    createdAt: new Date(today.getTime() - 14 * 86400000).toISOString(),
    validUntil: new Date(today.getTime() + 1 * 86400000).toISOString(),
  },
  {
    id: "PR-2003",
    leadId: "LD-1005",
    planId: "pln-inc-pro",
    appId: "incidentes",
    amount: 3600,
    currency: "PEN",
    status: "enviada",
    createdAt: new Date(today.getTime() - 5 * 86400000).toISOString(),
    validUntil: new Date(today.getTime() + 10 * 86400000).toISOString(),
  },
  {
    id: "PR-2004",
    leadId: "LD-1009",
    planId: "pln-vac-team",
    appId: "vacaciones",
    amount: 2900,
    currency: "PEN",
    status: "borrador",
    createdAt: new Date(today.getTime() - 1 * 86400000).toISOString(),
    validUntil: new Date(today.getTime() + 14 * 86400000).toISOString(),
  },
];

export const formatCurrency = (amount: number, currency: Currency) => {
  const map = { PEN: "es-PE", USD: "en-US", CLP: "es-CL" } as const;
  const code = currency;
  try {
    return new Intl.NumberFormat(map[currency], { style: "currency", currency: code, maximumFractionDigits: currency === "CLP" ? 0 : 2 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  diagnostico: "Diagnóstico",
  propuesta: "Propuesta",
  ganado: "Ganado",
  perdido: "Perdido",
};
