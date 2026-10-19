import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized, localizedList } from './localize';

/** Skills chapters in the current language. Chapter titles come as one line. */
export function useSkillsContent() {
  const { cmsData: { skills } } = useCms();
  const { lang, t } = useLanguage();

  return {
    heading1: localized(skills.heading1, lang, t.skills.heading1),
    heading2: localized(skills.heading2, lang, t.skills.heading2),
    desc: localized(skills.desc, lang, t.skills.desc),
    introLabel: t.skills.intro,
    scrollHint: t.skills.scrollHint,
    disciplines: [0, 1, 2].map((i) => {
      const d = skills.disciplines[i];
      const fallback = t.skills.disciplines[i];
      return {
        title: localized(d?.title, lang, fallback?.title).replace(/\n/g, ' '),
        tagline: localized(d?.tagline, lang, fallback?.tagline),
        tags: localizedList(d?.tags, lang, fallback?.tags),
      };
    }),
  };
}
