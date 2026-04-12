import { translations, Lang, Translations } from '../translations';
import type { CmsDataRaw, Bilingual } from '../types/cms';

/**
 * Extract translation for a language from bilingual field
 */
function extractLang<T>(bilingual: Bilingual<T> | T, lang: Lang, fallback: T): T {
  if (typeof bilingual === 'object' && bilingual !== null && 'en' in bilingual && 'ar' in bilingual) {
    return (bilingual as Bilingual<T>)[lang] ?? fallback;
  }
  // Fallback for non-bilingual values
  return bilingual as T;
}

/**
 * Merge CMS data with hardcoded translations
 * Returns translations for the specified language
 */
export function getCmsTranslations(cmsData: CmsDataRaw | null, lang: Lang): Translations {
  // Start with hardcoded translations
  const baseTranslations = translations[lang];

  if (!cmsData) {
    return baseTranslations;
  }

  // Build merged translations for the current language
  const merged = { ...baseTranslations };

  // Merge hero
  if (cmsData.hero) {
    merged.hero = {
      ...merged.hero,
      label: extractLang(cmsData.hero.label, lang, baseTranslations.hero.label),
      headline1: extractLang(cmsData.hero.headline1, lang, baseTranslations.hero.headline1),
      headline2: extractLang(cmsData.hero.headline2, lang, baseTranslations.hero.headline2),
      roles: extractLang(cmsData.hero.roles, lang, baseTranslations.hero.roles),
      desc: extractLang(cmsData.hero.desc, lang, baseTranslations.hero.desc),
      cta1: extractLang(cmsData.hero.cta1, lang, baseTranslations.hero.cta1),
      cta2: extractLang(cmsData.hero.cta2, lang, baseTranslations.hero.cta2),
      scroll: baseTranslations.hero.scroll, // Keep as is
    };
  }

  // Merge whyHireMe
  if (cmsData.whyHireMe) {
    merged.whyHireMe = {
      ...merged.whyHireMe,
      word1: extractLang(cmsData.whyHireMe.word1, lang, baseTranslations.whyHireMe.word1),
      word2: extractLang(cmsData.whyHireMe.word2, lang, baseTranslations.whyHireMe.word2),
      word3: extractLang(cmsData.whyHireMe.word3, lang, baseTranslations.whyHireMe.word3),
      cards: (cmsData.whyHireMe.cards || []).map((card, i) => ({
        title: extractLang(card.title, lang, baseTranslations.whyHireMe.cards[i]?.title ?? ''),
        desc: extractLang(card.desc, lang, baseTranslations.whyHireMe.cards[i]?.desc ?? ''),
      })),
    };
  }

  // Merge skills
  if (cmsData.skills) {
    merged.skills = {
      ...merged.skills,
      label: baseTranslations.skills.label,
      heading1: extractLang(cmsData.skills.heading1, lang, baseTranslations.skills.heading1),
      heading2: extractLang(cmsData.skills.heading2, lang, baseTranslations.skills.heading2),
      desc: extractLang(cmsData.skills.desc, lang, baseTranslations.skills.desc),
      disciplines: (cmsData.skills.disciplines || []).map((disc, i) => ({
        title: extractLang(disc.title, lang, baseTranslations.skills.disciplines[i]?.title ?? ''),
        tagline: extractLang(disc.tagline, lang, baseTranslations.skills.disciplines[i]?.tagline ?? ''),
        tags: extractLang(disc.tags, lang, baseTranslations.skills.disciplines[i]?.tags ?? []),
      })),
    };
  }

  // Merge tools
  if (cmsData.tools) {
    merged.tools = {
      ...merged.tools,
      label: baseTranslations.tools.label,
      category: baseTranslations.tools.category,
      specialties: baseTranslations.tools.specialties,
      navHint: baseTranslations.tools.navHint,
      title: extractLang(cmsData.tools.title, lang, baseTranslations.tools.title),
      desc: extractLang(cmsData.tools.desc, lang, baseTranslations.tools.desc),
      clickHint: extractLang(cmsData.tools.clickHint, lang, baseTranslations.tools.clickHint),
      proficiency: extractLang(cmsData.tools.proficiency, lang, baseTranslations.tools.proficiency),
      toolsData: baseTranslations.tools.toolsData,
    };
  }

  // Merge footer
  if (cmsData.footer) {
    merged.footer = {
      copyright: extractLang(cmsData.footer.copyright, lang, baseTranslations.footer.copyright),
      links: extractLang(cmsData.footer.links, lang, baseTranslations.footer.links),
    };
  }

  // Merge contact
  if (cmsData.contact) {
    merged.contact = {
      ...merged.contact,
      availability: extractLang(cmsData.contact.availability, lang, baseTranslations.contact.availability),
      headline1: extractLang(cmsData.contact.headline1, lang, baseTranslations.contact.headline1),
      headline2: extractLang(cmsData.contact.headline2, lang, baseTranslations.contact.headline2),
      headline3: extractLang(cmsData.contact.headline3, lang, baseTranslations.contact.headline3),
      body: extractLang(cmsData.contact.body, lang, baseTranslations.contact.body),
      note: extractLang(cmsData.contact.note, lang, baseTranslations.contact.note),
      signoff1: extractLang(cmsData.contact.signoff1, lang, baseTranslations.contact.signoff1),
      signoff2: extractLang(cmsData.contact.signoff2, lang, baseTranslations.contact.signoff2),
      emailLabel: extractLang(cmsData.contact.emailLabel, lang, baseTranslations.contact.emailLabel),
    };
  }

  return merged;
}
