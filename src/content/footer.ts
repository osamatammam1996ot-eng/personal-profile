import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized, localizedList } from './localize';

// The CMS edits the footer link labels; where they point is fixed
const LINK_TARGETS = ['home', 'work', 'why-me', 'contact'];

/** Footer copyright and links in the current language. */
export function useFooterContent() {
  const { cmsData: { footer } } = useCms();
  const { lang, t } = useLanguage();

  return {
    copyright: localized(footer.copyright, lang, t.footer.copyright),
    links: localizedList(footer.links, lang, t.footer.links).map((label, i) => ({ label, target: LINK_TARGETS[i] })),
  };
}
