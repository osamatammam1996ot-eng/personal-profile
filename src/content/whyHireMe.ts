import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized } from './localize';

/** Why Hire Me title and the text of each floating card, in the current language. */
export function useWhyHireMeContent() {
  const { cmsData: { whyHireMe } } = useCms();
  const { lang, t } = useLanguage();

  const title = [
    localized(whyHireMe.word1, lang, t.whyHireMe.word1),
    localized(whyHireMe.word2, lang, t.whyHireMe.word2),
    localized(whyHireMe.word3, lang, t.whyHireMe.word3),
  ].filter(Boolean).join(' ');

  /** Text for card `i`; `fallbackTitle` covers a card the CMS and translations both lack */
  const card = (i: number, fallbackTitle: string) => ({
    title: localized(whyHireMe.cards[i]?.title, lang, t.whyHireMe.cards[i]?.title || fallbackTitle),
    desc: localized(whyHireMe.cards[i]?.desc, lang, t.whyHireMe.cards[i]?.desc || ''),
  });

  return { title, card };
}
