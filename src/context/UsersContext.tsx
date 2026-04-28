import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { USERS_SEED, type AppUser } from "@/data/users";

type Ctx = {
  users: AppUser[];
  addUser: (u: AppUser) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  removeUser: (id: string) => void;
};

const UsersCtx = createContext<Ctx | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(USERS_SEED);

  const addUser = useCallback((u: AppUser) => setUsers((p) => [u, ...p]), []);
  const updateUser = useCallback(
    (id: string, patch: Partial<AppUser>) =>
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, ...patch } : u))),
    [],
  );
  const removeUser = useCallback(
    (id: string) => setUsers((p) => p.filter((u) => u.id !== id)),
    [],
  );

  return (
    <UsersCtx.Provider value={{ users, addUser, updateUser, removeUser }}>
      {children}
    </UsersCtx.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersCtx);
  if (!ctx) throw new Error("useUsers must be used inside UsersProvider");
  return ctx;
}
