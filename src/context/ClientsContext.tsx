import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CLIENTS_SEED, SUBSCRIPTIONS_SEED, type Client, type Subscription } from "@/data/clients";
import {
  CLIENT_CONTACTS_SEED,
  CLIENT_USERS_SEED,
  EXTRA_PACKS_SEED,
  type ClientContact,
  type ClientUser,
  type ExtraPack,
} from "@/data/clientExtras";

type Ctx = {
  clients: Client[];
  subscriptions: Subscription[];
  addClient: (c: Client) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  addSubscription: (s: Subscription) => void;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  removeSubscription: (id: string) => void;

  // Contactos extra
  contacts: ClientContact[];
  addContact: (c: ClientContact) => void;
  updateContact: (id: string, patch: Partial<ClientContact>) => void;
  removeContact: (id: string) => void;

  // Usuarios del cliente
  clientUsers: ClientUser[];
  addClientUser: (u: ClientUser) => void;
  updateClientUser: (id: string, patch: Partial<ClientUser>) => void;
  removeClientUser: (id: string) => void;

  // Packs extra
  extraPacks: ExtraPack[];
  addExtraPack: (p: ExtraPack) => void;
  updateExtraPack: (id: string, patch: Partial<ExtraPack>) => void;
  removeExtraPack: (id: string) => void;
};

const ClientsCtx = createContext<Ctx | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(CLIENTS_SEED);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(SUBSCRIPTIONS_SEED);
  const [contacts, setContacts] = useState<ClientContact[]>(CLIENT_CONTACTS_SEED);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>(CLIENT_USERS_SEED);
  const [extraPacks, setExtraPacks] = useState<ExtraPack[]>(EXTRA_PACKS_SEED);

  const addClient = useCallback((c: Client) => setClients((p) => [c, ...p]), []);
  const updateClient = useCallback(
    (id: string, patch: Partial<Client>) =>
      setClients((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [],
  );
  const removeClient = useCallback((id: string) => {
    setClients((p) => p.filter((c) => c.id !== id));
    setSubscriptions((p) => p.filter((s) => s.clientId !== id));
    setContacts((p) => p.filter((c) => c.clientId !== id));
    setClientUsers((p) => p.filter((u) => u.clientId !== id));
    setExtraPacks((p) => p.filter((x) => x.clientId !== id));
  }, []);

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

  // Contactos
  const addContact = useCallback((c: ClientContact) => setContacts((p) => [c, ...p]), []);
  const updateContact = useCallback(
    (id: string, patch: Partial<ClientContact>) =>
      setContacts((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [],
  );
  const removeContact = useCallback(
    (id: string) => setContacts((p) => p.filter((c) => c.id !== id)),
    [],
  );

  // Usuarios del cliente
  const addClientUser = useCallback((u: ClientUser) => setClientUsers((p) => [u, ...p]), []);
  const updateClientUser = useCallback(
    (id: string, patch: Partial<ClientUser>) =>
      setClientUsers((p) => p.map((u) => (u.id === id ? { ...u, ...patch } : u))),
    [],
  );
  const removeClientUser = useCallback(
    (id: string) => setClientUsers((p) => p.filter((u) => u.id !== id)),
    [],
  );

  // Packs
  const addExtraPack = useCallback((x: ExtraPack) => setExtraPacks((p) => [x, ...p]), []);
  const updateExtraPack = useCallback(
    (id: string, patch: Partial<ExtraPack>) =>
      setExtraPacks((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    [],
  );
  const removeExtraPack = useCallback(
    (id: string) => setExtraPacks((p) => p.filter((x) => x.id !== id)),
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
        contacts,
        addContact,
        updateContact,
        removeContact,
        clientUsers,
        addClientUser,
        updateClientUser,
        removeClientUser,
        extraPacks,
        addExtraPack,
        updateExtraPack,
        removeExtraPack,
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
