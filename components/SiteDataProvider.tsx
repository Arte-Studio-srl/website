'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { SiteConfig, Project, Category } from '@/types';

interface SiteDataContextType {
  siteConfig: SiteConfig;
  projects: Project[];
  categories: Category[];
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: SiteDataContextType;
}) {
  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
