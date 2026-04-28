import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Boxes,
  TrendingUp,
  Settings,
  Building2,
  Wallet,
  UserCog,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { APPS } from "@/data/apps";
import { cn } from "@/lib/utils";

const crmNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, end: true },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Propuestas", url: "/propuestas", icon: FileText },
  { title: "Pipeline", url: "/pipeline", icon: TrendingUp },
];

const productNav = [
  { title: "Aplicaciones", url: "/apps", icon: Boxes },
  { title: "Planes y Precios", url: "/planes", icon: Package },
  { title: "Clientes", url: "/clientes", icon: Building2 },
];

const finanzasNav = [
  { title: "Finanzas Netesa", url: "/finanzas", icon: Wallet },
  { title: "Usuarios", url: "/usuarios", icon: UserCog },
];

const adminNav = [
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { activeApp } = useAppContext();
  const currentApp = activeApp !== "all" ? APPS.find((a) => a.id === activeApp) : null;

  const linkClass =
    "relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground transition-base hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const activeClass =
    "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-sidebar-primary";

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarContent className="gap-0 px-2 py-3">
        {currentApp && (
          <div
            className={cn(
              "mx-1 mb-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5",
              collapsed && "flex items-center justify-center p-1.5",
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-primary-foreground", currentApp.bgVar)}>
                <currentApp.icon className="h-4 w-4" />
              </span>
              {!collapsed && (
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-semibold leading-tight">{currentApp.name}</span>
                  <span className="text-[10px] text-muted-foreground">Vista filtrada</span>
                </div>
              )}
            </div>
          </div>
        )}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CRM Comercial</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {crmNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.end} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Catálogo</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {productNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Core Netesa</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {finanzasNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={linkClass} activeClassName={activeClass}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
