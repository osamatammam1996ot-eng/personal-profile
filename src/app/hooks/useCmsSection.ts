import { useCms } from '../contexts/CmsContext';

type Language = 'en' | 'ar';

export interface SectionData {
  getField(key: string, lang: Language): string;
  getText(key: string, lang: Language): string;
  getList(key: string, lang: Language): string[];
  getCard(index: number): any;
  getCards(): any[];
  getImage(key: string): { url: string; alt: string } | null;
  getCaseStudy(index: number): any;
  getCaseStudies(): any[];
  raw: any;
}

/**
 * Hook to fetch and format data for a specific CMS section
 * Usage: const section = useCmsSection('hero', 'en');
 */
export function useCmsSection(sectionKey: string, lang: Language = 'en'): SectionData {
  const { content, loading, error } = useCms();
  
  const section = content[sectionKey] || {
    fields: {},
    lists: {},
    cards: [],
    images: {},
    caseStudies: [],
  };

  return {
    /**
     * Get a text field (with language suffix)
     * Example: getField('title', 'en') returns content.sections['title_en']
     */
    getField(key: string, language: Language = lang): string {
      return section.fields[`${key}_${language}`] || '';
    },

    /**
     * Alias for getField
     */
    getText(key: string, language: Language = lang): string {
      return this.getField(key, language);
    },

    /**
     * Get a list of items in specified language
     * Example: getList('skills', 'en') returns all items in that list in English
     */
    getList(key: string, language: Language = lang): string[] {
      const list = section.lists[key] || [];
      return list.map((item: any) => item[language] || '');
    },

    /**
     * Get a single card by index
     */
    getCard(index: number): any {
      return section.cards[index] || null;
    },

    /**
     * Get all cards for this section
     */
    getCards(): any[] {
      return section.cards || [];
    },

    /**
     * Get an image with alt text for specified language
     */
    getImage(key: string): { url: string; alt: string } | null {
      const img = section.images[key];
      if (!img) return null;
      return {
        url: img.url || '',
        alt: img[`alt_${lang}`] || img.alt_en || '',
      };
    },

    /**
     * Get a single case study by index
     */
    getCaseStudy(index: number): any {
      return section.caseStudies[index] || null;
    },

    /**
     * Get all case studies
     */
    getCaseStudies(): any[] {
      return section.caseStudies || [];
    },

    /**
     * Raw section data (for advanced usage)
     */
    raw: section,
  };
}
