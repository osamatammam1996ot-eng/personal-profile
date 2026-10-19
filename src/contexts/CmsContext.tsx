"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CmsData } from '../types/cms';
import { DEFAULT_CMS_DATA } from '../types/cms';
import { clone, normalizeCmsData } from '../lib/cms-normalize';

const CmsContext = createContext<CmsData | undefined>(undefined);

// Last good copy, so a visitor who loses the connection still sees real content
const STORAGE_KEY = 'cms:portfolio:v2:local';

function readSavedCopy(): unknown {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Holds the site content. It renders immediately with the server-provided data (or the
 * defaults), then refreshes from the CMS; if that fails it falls back to the last good copy.
 * Sections don't read this directly: they go through the hooks in src/content.
 */
export function CmsProvider({ children, initialData }: { children: React.ReactNode; initialData?: CmsData | null }) {
  const [cmsData, setCmsData] = useState<CmsData>(() => initialData ? normalizeCmsData(initialData) : clone(DEFAULT_CMS_DATA));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let fresh: unknown = null;
      try {
        const { getCmsDataAction } = await import('@/app/actions/cms');
        const response = await getCmsDataAction();
        if (response.error) throw new Error(response.error);
        fresh = response.data;
      } catch (err) {
        console.warn('CMS fetch failed, using saved/default content:', err);
      }

      const next = normalizeCmsData(fresh ?? readSavedCopy() ?? initialData ?? DEFAULT_CMS_DATA);
      if (cancelled) return;
      setCmsData(next);
      if (fresh) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage full or blocked */ }
      }
    })();
    return () => { cancelled = true; };
  }, [initialData]);

  return <CmsContext.Provider value={cmsData}>{children}</CmsContext.Provider>;
}

/** Raw CMS data. Use it from the content hooks in src/content, not from components. */
export function useCms() {
  const cmsData = useContext(CmsContext);
  if (!cmsData) throw new Error('useCms must be used within CmsProvider');
  return { cmsData };
}
