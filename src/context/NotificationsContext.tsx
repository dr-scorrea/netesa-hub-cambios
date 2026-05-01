import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { NOTIFICATIONS_SEED, type Notification } from "@/data/notifications";

type Ctx = {
  items: Notification[];
  unread: number;
  markOne: (id: string) => void;
  markAll: () => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS_SEED);

  const markOne = useCallback((id: string) => {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAll = useCallback(() => {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ items, unread: items.filter((i) => !i.read).length, markOne, markAll }),
    [items, markOne, markAll],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
  return ctx;
}
