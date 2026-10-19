import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized, localizedList } from './localize';

const DEFAULT_ORDER = ['avatar', 'label', 'headline', 'roles', 'desc', 'ctas'];

/** Hero text in the current language, plus which parts are shown and in what order. */
export function useHeroContent() {
  const { cmsData: { hero } } = useCms();
  const { lang, t } = useLanguage();

  return {
    label: localized(hero.label, lang, t.hero.label),
    headline1: localized(hero.headline1, lang, t.hero.headline1),
    headline2: localized(hero.headline2, lang, t.hero.headline2),
    roles: localizedList(hero.roles, lang, t.hero.roles),
    desc: localized(hero.desc, lang, t.hero.desc),
    primaryCta: localized(hero.cta1, lang, t.hero.cta1),
    secondaryCta: localized(hero.cta2, lang, t.hero.cta2),
    order: hero.elementOrder ?? DEFAULT_ORDER,
    show: {
      avatar: hero.showAvatar !== false,
      label: hero.showLabel !== false,
      headline: hero.showHeadline !== false,
      desc: hero.showDesc !== false,
    },
  };
}
