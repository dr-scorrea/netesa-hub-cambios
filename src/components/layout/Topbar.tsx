import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSwitcher } from "./AppSwitcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPopover } from "./NotificationsPopover";
import { HelpPopover } from "./HelpPopover";
import { GlobalSearch } from "./GlobalSearch";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden h-6 w-px bg-border md:block" />
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow">
          <span className="text-sm font-bold">N</span>
        </div>
        <span className="text-base font-semibold tracking-tight inline">ERP Netesa</span>
      </div>
      <div className="ml-2 hidden md:block">
        <AppSwitcher />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch />
        <HelpPopover />
        <NotificationsPopover />
        <Button asChild variant="ghost" size="icon" className="h-10 w-10" title="Cerrar sesión">
          <Link to="/auth">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </Link>
        </Button>
        <div className="ml-1 flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">LR</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-xs font-semibold">Lucía Ramírez</span>
            <span className="text-[10px] text-muted-foreground">Comercial · Netesa</span>
          </div>
        </div>
      </div>
    </header>
  );
}
