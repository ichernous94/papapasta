'use client';
import { createContext, useState, type ReactNode } from 'react';
import type { RevealRegistry } from './registry';

export const RevealContext = createContext<RevealRegistry | null>(null);
export default function RevealProvider({ children }: { children: ReactNode }) {
  // A fresh registry per document/provider, never shared between server requests.
  const [registry] = useState<RevealRegistry>(() => new Map());
  return <RevealContext.Provider value={registry}>{children}</RevealContext.Provider>;
}
