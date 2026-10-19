import { useCms } from '../contexts/CmsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_CMS_DATA } from '../types/cms';
import { absoluteUrl, localized } from './localize';

const SOCIAL_NAMES = { whatsapp: 'WhatsApp', facebook: 'Facebook', linkedin: 'LinkedIn', behance: 'Behance' } as const;
export type SocialName = (typeof SOCIAL_NAMES)[keyof typeof SOCIAL_NAMES];

/** Contact section text in the current language, plus the email and the social links that are set. */
export function useContactContent() {
  const { cmsData: { contact } } = useCms();
  const { lang, t } = useLanguage();

  const headlineFromCms = [contact.headline1, contact.headline2, contact.headline3].map((line) => localized(line, lang));

  return {
    email: contact.email || DEFAULT_CMS_DATA.contact.email,
    emailLabel: localized(contact.emailLabel, lang, t.contact.emailLabel),
    availability: localized(contact.availability, lang, t.contact.availability),
    /** Lines of the big headline */
    headline: headlineFromCms[0] ? headlineFromCms : t.contact.headline,
    body: localized(contact.body, lang, t.contact.body),
    /** Lines of the small note under the socials */
    note: contact.note?.[lang] ? [contact.note[lang]] : t.contact.note,
    meetingAction: contact.showMeetingAction === false ? null : localized(contact.meetingAction, lang, t.contact.meetingAction),
    // Only the networks with a link set, so an empty field never becomes a dead button
    socials: (Object.keys(SOCIAL_NAMES) as (keyof typeof SOCIAL_NAMES)[])
      .filter((key) => contact.socials[key])
      .map((key) => ({ name: SOCIAL_NAMES[key], url: absoluteUrl(contact.socials[key]) })),
  };
}
