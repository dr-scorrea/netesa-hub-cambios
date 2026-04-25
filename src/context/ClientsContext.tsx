import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CLIENTS_SEED, SUBSCRIPTIONS_SEED, type Client, type Subscription } from "@/data/clients";

type Ctx = {
  clients: Client[];
  subscriptions: Subscription[];
  addClient: (c: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  addSubscription: (s: Subscription) => void;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  removeSubscription: (id: string) => void;
};

const ClientsCtx = createContext<Ctx | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(CLIENTS_SEED);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(SUBSCRIPTIONS_SEED);

  const addClient = useCallback((c: Client) => setClients((p) => [c, ...p]), []);
  const updateClient = useCallback(
    (id: string, patch: Partial<Client>) =>
      setClients((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [],
  );
  const removeClient = useCallback(
    (id: string) => {
      setClients((p) => p.filter((c) => c.id !== id));
      setSubscriptions((p) => p.filter((s) => s.clientId !== id));
    },
    [],
  );
  const addSubscription = useCallback((s: Subscription) => setSubscriptions((p) => [s, ...p]), []);
  const updateSubscription = useCallback(
    (id: string, patch: Partial<Subscription>) =>
      setSubscriptions((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    [],
  );
  const removeSubscription = useCallback(
    (id: string) => setSubscriptions((p) => p.filter((s) => s.id !== id)),
    [],
  );

  return (
    <ClientsCtx.Provider
      value={{
        clients,
        subscriptions,
        addClient,
        updateClient,
        removeClient,
        addSubscription,
        updateSubscription,
        removeSubscription,
      }}
    >
      {children}
    </ClientsCtx.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsCtx);
  if (!ctx) throw new Error("useClients must be used inside ClientsProvider");
  return ctx;
}
