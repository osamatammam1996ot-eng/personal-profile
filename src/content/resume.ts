import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { localized } from './localize';

const DEFAULT_FILE_NAME = 'Resume.pdf';

/**
 * A link that saves the file instead of opening it. Supabase storage sends the file as a
 * download when asked with `?download=<name>`; the `download` attribute alone is ignored
 * by browsers for files on another domain.
 */
function downloadHref(url: string, fileName: string): string {
  if (!url.includes('/storage/v1/object/public/')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}download=${encodeURIComponent(fileName)}`;
}

/** The resume island's text and link, or null when there's no resume to offer. */
export function useResumeContent() {
  const { cmsData: { resume } } = useCms();
  const { lang, t } = useLanguage();

  if (!resume.visible || !resume.url) return null;

  const fileName = resume.fileName || DEFAULT_FILE_NAME;
  return {
    label: localized(resume.label, lang, t.resume.download),
    href: downloadHref(resume.url, fileName),
    fileName,
  };
}
