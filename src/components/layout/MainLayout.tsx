import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { AppContextProvider } from "@/context/AppContext";
import { FinanzasProvider } from "@/context/FinanzasContext";
import { ClientsProvider } from "@/context/ClientsContext";
import { UsersProvider } from "@/context/UsersContext";
import { ProposalsProvider } from "@/context/ProposalsContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <AppContextProvider>
      <ClientsProvider>
        <UsersProvider>
        <FinanzasProvider>
          <ProposalsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gradient-subtle">
              <AppSidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />
                <main className="flex-1 bg-gradient-mesh">
                  <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8 animate-fade-in">
                    <Outlet />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
          </ProposalsProvider>
        </FinanzasProvider>
        </UsersProvider>
      </ClientsProvider>
    </AppContextProvider>
  );
}
