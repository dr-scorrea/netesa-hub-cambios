export type UserRole = "admin" | "manager" | "comercial" | "finanzas" | "soporte" | "viewer";
export type UserStatus = "activo" | "invitado" | "suspendido";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  jobTitle: string;
  createdAt: string;
  lastLoginAt?: string;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Manager",
  comercial: "Comercial",
  finanzas: "Finanzas",
  soporte: "Soporte",
  viewer: "Solo lectura",
};

export const STATUS_LABEL: Record<UserStatus, string> = {
  activo: "Activo",
  invitado: "Invitado",
  suspendido: "Suspendido",
};

export const DEPARTMENTS = [
  "Comercial",
  "Finanzas",
  "Operaciones",
  "Producto",
  "Soporte",
  "Marketing",
  "Dirección",
] as const;

export const USERS_SEED: AppUser[] = [
  {
    id: "USR-001",
    fullName: "Lucía Ramírez",
    email: "lramirez@netesa.com",
    phone: "+51 987 111 222",
    role: "manager",
    status: "activo",
    department: "Comercial",
    jobTitle: "Head of Sales",
    createdAt: "2024-05-10T10:00:00Z",
    lastLoginAt: "2026-04-27T08:30:00Z",
  },
  {
    id: "USR-002",
    fullName: "Diego Torres",
    email: "dtorres@netesa.com",
    phone: "+51 988 222 333",
    role: "comercial",
    status: "activo",
    department: "Comercial",
    jobTitle: "Account Executive",
    createdAt: "2024-06-20T10:00:00Z",
    lastLoginAt: "2026-04-27T15:00:00Z",
  },
  {
    id: "USR-003",
    fullName: "Camila Soto",
    email: "csoto@netesa.com",
    phone: "+56 9 7766 5544",
    role: "comercial",
    status: "activo",
    department: "Comercial",
    jobTitle: "Account Executive",
    createdAt: "2024-07-01T10:00:00Z",
    lastLoginAt: "2026-04-26T11:20:00Z",
  },
  {
    id: "USR-004",
    fullName: "Andrés Vega",
    email: "avega@netesa.com",
    phone: "+51 999 555 666",
    role: "finanzas",
    status: "activo",
    department: "Finanzas",
    jobTitle: "Finance Lead",
    createdAt: "2024-04-15T10:00:00Z",
    lastLoginAt: "2026-04-28T09:00:00Z",
  },
  {
    id: "USR-005",
    fullName: "Marco Salinas",
    email: "msalinas@netesa.com",
    role: "admin",
    status: "activo",
    department: "Dirección",
    jobTitle: "CEO",
    createdAt: "2024-01-01T10:00:00Z",
    lastLoginAt: "2026-04-28T07:45:00Z",
  },
  {
    id: "USR-006",
    fullName: "Paula Mendoza",
    email: "pmendoza@netesa.com",
    role: "soporte",
    status: "activo",
    department: "Soporte",
    jobTitle: "Customer Success",
    createdAt: "2024-09-01T10:00:00Z",
    lastLoginAt: "2026-04-27T16:10:00Z",
  },
  {
    id: "USR-007",
    fullName: "Renato Quispe",
    email: "rquispe@netesa.com",
    role: "viewer",
    status: "invitado",
    department: "Producto",
    jobTitle: "Product Analyst",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "USR-008",
    fullName: "Julia Fernández",
    email: "jfernandez@netesa.com",
    role: "comercial",
    status: "suspendido",
    department: "Comercial",
    jobTitle: "SDR",
    createdAt: "2024-10-12T10:00:00Z",
    lastLoginAt: "2026-02-10T13:00:00Z",
  },
];
