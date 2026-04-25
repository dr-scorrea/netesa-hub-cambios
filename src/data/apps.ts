import { Scale, Plane, AlertTriangle, Target, GraduationCap, Wallet, LayoutGrid, type LucideIcon } from "lucide-react";

export type AppId = "nodlex" | "vacaciones" | "incidentes" | "desempeno" | "dnc" | "finanzas";

export type SaasApp = {
  id: AppId;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  colorVar: string; // tailwind utility class like "text-app-nodlex"
  bgVar: string;
  active: boolean;
  category: "saas" | "core";
};

export const APPS: SaasApp[] = [
  {
    id: "nodlex",
    name: "NodLex",
    shortName: "NodLex",
    description: "Gestión integral de estudios de abogados y áreas legales.",
    icon: Scale,
    colorVar: "text-app-nodlex",
    bgVar: "bg-app-nodlex",
    active: true,
    category: "saas",
  },
  {
    id: "vacaciones",
    name: "Vacaciones",
    shortName: "Vacaciones",
    description: "Gestión de ausencias, descansos y aprobaciones de personal.",
    icon: Plane,
    colorVar: "text-app-vacaciones",
    bgVar: "bg-app-vacaciones",
    active: true,
    category: "saas",
  },
  {
    id: "incidentes",
    name: "Registro de Incidentes",
    shortName: "Incidentes",
    description: "Tickets operativos y de seguridad y salud en el trabajo.",
    icon: AlertTriangle,
    colorVar: "text-app-incidentes",
    bgVar: "bg-app-incidentes",
    active: true,
    category: "saas",
  },
  {
    id: "desempeno",
    name: "Gestión del Desempeño",
    shortName: "Desempeño",
    description: "Evaluaciones, KPIs y feedback continuo de personal.",
    icon: Target,
    colorVar: "text-app-desempeno",
    bgVar: "bg-app-desempeno",
    active: true,
    category: "saas",
  },
  {
    id: "dnc",
    name: "DNC",
    shortName: "DNC",
    description: "Detección de necesidades y planes de capacitación.",
    icon: GraduationCap,
    colorVar: "text-app-dnc",
    bgVar: "bg-app-dnc",
    active: false,
    category: "saas",
  },
  {
    id: "finanzas",
    name: "Finanzas Netesa",
    shortName: "Finanzas",
    description: "Facturación interna y proveedores de Netesa.",
    icon: Wallet,
    colorVar: "text-app-finanzas",
    bgVar: "bg-app-finanzas",
    active: true,
    category: "core",
  },
];

export const ALL_APPS_OPTION = {
  id: "all" as const,
  name: "Todo el ecosistema",
  shortName: "Ecosistema",
  description: "Visión consolidada de todas las aplicaciones SaaS.",
  icon: LayoutGrid,
};

export type AppFilter = AppId | "all";

export const getApp = (id: AppId) => APPS.find((a) => a.id === id)!;
