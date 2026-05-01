import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Apps from "./pages/Apps";
import Planes from "./pages/Planes";
import Propuestas from "./pages/Propuestas";
import Pipeline from "./pages/Pipeline";
import Finanzas from "./pages/Finanzas";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import ClienteConfig from "./pages/ClienteConfig";
import ContactoForm from "./pages/ContactoForm";
import Notificaciones from "./pages/Notificaciones";
import Ayuda from "./pages/Ayuda";
import CentroAyuda from "./pages/ayuda/CentroAyuda";
import Novedades from "./pages/ayuda/Novedades";
import Atajos from "./pages/ayuda/Atajos";
import Soporte from "./pages/ayuda/Soporte";
import { Configuracion } from "./pages/Placeholder";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/propuestas" element={<Propuestas />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/finanzas" element={<Finanzas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id/configuracion" element={<ClienteConfig />} />
            <Route path="/clientes/:id/contactos/nuevo" element={<ContactoForm />} />
            <Route path="/clientes/:id/contactos/:contactoId/editar" element={<ContactoForm />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/ayuda/centro" element={<CentroAyuda />} />
            <Route path="/ayuda/novedades" element={<Novedades />} />
            <Route path="/ayuda/atajos" element={<Atajos />} />
            <Route path="/ayuda/soporte" element={<Soporte />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
