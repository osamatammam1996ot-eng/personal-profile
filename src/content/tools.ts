import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized } from './localize';

/** Tools section text and the tool list for the gem's faces. */
export function useToolsContent() {
  const { cmsData: { tools } } = useCms();
  const { lang, t } = useLanguage();

  return {
    title: localized(tools.title, lang, t.tools.title),
    desc: localized(tools.desc, lang, t.tools.desc),
    clickHint: localized(tools.clickHint, lang, t.tools.clickHint),
    list: tools.toolsList ?? [],
  };
}
