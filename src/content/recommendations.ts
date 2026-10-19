import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized } from './localize';

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  position: string;
}

/** Testimonials marked visible in the CMS, in the current language. */
export function useTestimonials(): Testimonial[] {
  const { cmsData } = useCms();
  const { lang } = useLanguage();

  return cmsData.recommendations
    .filter((r) => r.visible)
    .map((r) => ({
      id: r.id,
      name: r.name,
      comment: localized(r.comment, lang),
      position: localized(r.position, lang),
    }));
}
