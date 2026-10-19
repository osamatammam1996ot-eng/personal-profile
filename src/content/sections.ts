import { useCms } from '../contexts/CmsContext';
import type { CmsSections } from '../types/cms';

export type SectionKey = keyof CmsSections;

/** The page's sections in the order the CMS sets, skipping the ones switched off. */
export function useVisibleSections(): SectionKey[] {
  const { cmsData } = useCms();
  return cmsData.sectionOrder.filter(
    (key): key is SectionKey => key in cmsData.sections && cmsData.sections[key as SectionKey],
  );
}

/** DOM id of each section, used by in-page links */
export const SECTION_DOM_IDS: Partial<Record<SectionKey, string>> = {
  hero: 'home',
  whyHireMe: 'why-me',
  skills: 'skills',
  portfolio: 'work',
  recommendations: 'recommendations',
  tools: 'tools',
  contact: 'contact',
};
