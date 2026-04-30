import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PROPOSALS, type Proposal } from "@/data/crm";

type Ctx = {
  proposals: Proposal[];
  addProposal: (p: Proposal) => void;
  updateProposal: (id: string, patch: Partial<Proposal>) => void;
  removeProposal: (id: string) => void;
};

const ProposalsCtx = createContext<Ctx | undefined>(undefined);

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>(PROPOSALS);

  const addProposal = useCallback((p: Proposal) => setProposals((prev) => [p, ...prev]), []);
  const updateProposal = useCallback(
    (id: string, patch: Partial<Proposal>) =>
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [],
  );
  const removeProposal = useCallback(
    (id: string) => setProposals((prev) => prev.filter((p) => p.id !== id)),
    [],
  );

  return (
    <ProposalsCtx.Provider value={{ proposals, addProposal, updateProposal, removeProposal }}>
      {children}
    </ProposalsCtx.Provider>
  );
}

export function useProposals() {
  const ctx = useContext(ProposalsCtx);
  if (!ctx) throw new Error("useProposals must be used inside ProposalsProvider");
  return ctx;
}
