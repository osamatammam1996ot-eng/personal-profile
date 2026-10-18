"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { CmsData } from '../types/cms';
import { DEFAULT_CMS_DATA } from '../types/cms';
import { clone, normalizeCmsData } from '../lib/cms-normalize';

type CmsContextType = {
  cmsData: CmsData;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

const STORAGE_KEY = 'cms:portfolio:v2:local';

export function CmsProvider({ children, initialData }: { children: React.ReactNode; initialData?: CmsData | null }) {
  const [cmsData, setCmsData] = useState<CmsData>(() => initialData ? normalizeCmsData(initialData) : clone(DEFAULT_CMS_DATA));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyCmsData = useCallback((rawData: unknown) => {
    const nextCms = normalizeCmsData(rawData);
    setCmsData(nextCms);
    return nextCms;
  }, []);

  const fetchAllContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { getCmsDataAction } = await import('@/app/actions/cms');
      const response = await getCmsDataAction();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const normalized = applyCmsData(response.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          applyCmsData(JSON.parse(saved));
        } else {
          applyCmsData(initialData || DEFAULT_CMS_DATA);
        }
      }
    } catch (fetchError) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          applyCmsData(JSON.parse(saved));
        } else {
          applyCmsData(initialData || DEFAULT_CMS_DATA);
        }
      } catch {
        applyCmsData(initialData || DEFAULT_CMS_DATA);
      }

      console.warn('CMS fetch failed, using local/default data:', fetchError);
    } finally {
      setLoading(false);
    }
  }, [applyCmsData, initialData]);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  return (
    <CmsContext.Provider
      value={{
        cmsData,
        loading,
        error,
        refetch: fetchAllContent,
        refresh: fetchAllContent,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within CmsProvider');
  }
  return context;
}
