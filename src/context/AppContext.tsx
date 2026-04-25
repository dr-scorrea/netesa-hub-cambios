import { createContext, useContext, useState, type ReactNode } from "react";
import type { AppFilter } from "@/data/apps";

type Ctx = {
  activeApp: AppFilter;
  setActiveApp: (a: AppFilter) => void;
};

const AppContextCtx = createContext<Ctx | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeApp, setActiveApp] = useState<AppFilter>("all");
  return <AppContextCtx.Provider value={{ activeApp, setActiveApp }}>{children}</AppContextCtx.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContextCtx);
  if (!ctx) throw new Error("useAppContext must be used inside AppContextProvider");
  return ctx;
};
