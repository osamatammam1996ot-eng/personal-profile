import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';

/** One case study with its title in the current language, or null if it doesn't exist. */
export function useCaseStudy(id: number) {
  const { cmsData } = useCms();
  const { lang } = useLanguage();

  const study = cmsData.caseStudies.find((c) => c.id === id);
  if (!study) return null;

  // Older saves stored the title as a plain string rather than { en, ar }
  const title: unknown = study.title;
  const localizedTitle = typeof title === 'string'
    ? title
    : study.title[lang] || study.title.en || '';

  return { ...study, title: localizedTitle };
}
