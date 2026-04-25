import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { FACTURAS_SEED, type Factura, type FacturaEstado } from "@/data/finanzas";

type Ctx = {
  facturas: Factura[];
  addFactura: (f: Factura) => void;
  updateFactura: (id: string, patch: Partial<Factura>) => void;
  setEstado: (id: string, estado: FacturaEstado) => void;
  removeFactura: (id: string) => void;
};

const FinanzasCtx = createContext<Ctx | undefined>(undefined);

export function FinanzasProvider({ children }: { children: ReactNode }) {
  const [facturas, setFacturas] = useState<Factura[]>(FACTURAS_SEED);

  const addFactura = useCallback((f: Factura) => {
    setFacturas((prev) => [f, ...prev]);
  }, []);

  const updateFactura = useCallback((id: string, patch: Partial<Factura>) => {
    setFacturas((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const setEstado = useCallback((id: string, estado: FacturaEstado) => {
    setFacturas((prev) => prev.map((f) => (f.id === id ? { ...f, estado } : f)));
  }, []);

  const removeFactura = useCallback((id: string) => {
    setFacturas((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <FinanzasCtx.Provider value={{ facturas, addFactura, updateFactura, setEstado, removeFactura }}>
      {children}
    </FinanzasCtx.Provider>
  );
}

export function useFinanzas() {
  const ctx = useContext(FinanzasCtx);
  if (!ctx) throw new Error("useFinanzas must be used inside FinanzasProvider");
  return ctx;
}
