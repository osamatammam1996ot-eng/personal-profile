import type { Bilingual } from '../types/cms';
import type { Lang } from '../translations';

/** A CMS text in the current language, or `fallback` when the editor left it empty. */
export function localized(field: Bilingual | undefined, lang: Lang, fallback = ''): string {
  return field?.[lang] || fallback;
}

/** Same for lists (roles, tags…): an empty list falls back too. */
export function localizedList(field: Bilingual<string[]> | undefined, lang: Lang, fallback: string[] = []): string[] {
  const list = field?.[lang];
  return list?.length ? list : fallback;
}

/** Social links are often saved without the protocol ("linkedin.com/in/…"). */
export function absoluteUrl(url: string): string {
  if (!url) return '';
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}
