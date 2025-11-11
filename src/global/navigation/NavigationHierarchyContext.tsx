'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { PrimaryNavHierarchy } from './navigation.types';

const defaultHierarchy: PrimaryNavHierarchy = {
  gigwan: null,
  jojiks: [],
};

type HierarchyContextValue = PrimaryNavHierarchy;
type HierarchySetter = (hierarchy: PrimaryNavHierarchy) => void;

type HierarchyContextTuple = [HierarchyContextValue, HierarchySetter];

const HierarchyContext = createContext<HierarchyContextTuple | null>(null);

export type NavigationHierarchyProviderProps = {
  children: ReactNode;
};

export function NavigationHierarchyProvider({ children }: NavigationHierarchyProviderProps) {
  const [hierarchy, setHierarchy] = useState<PrimaryNavHierarchy>(defaultHierarchy);
  const value = useMemo<HierarchyContextTuple>(() => [hierarchy, setHierarchy], [hierarchy]);

  return <HierarchyContext.Provider value={value}>{children}</HierarchyContext.Provider>;
}

export const useNavigationHierarchyState = (): HierarchyContextTuple => {
  const ctx = useContext(HierarchyContext);
  if (!ctx) return [defaultHierarchy, () => {}];
  return ctx;
};

export const useNavigationHierarchy = (): PrimaryNavHierarchy => {
  const [hierarchy] = useNavigationHierarchyState();
  return hierarchy;
};

export const useSetNavigationHierarchy = (): HierarchySetter => {
  const [, setHierarchy] = useNavigationHierarchyState();
  return setHierarchy;
};

