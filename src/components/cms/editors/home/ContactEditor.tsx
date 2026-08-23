import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses, labelClasses, inputClasses } from '../../../../components/cms/shared/BilingualField';

interface ContactEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function ContactEditor({ draft, updateDraft }: ContactEditorProps) {
  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Contact Section</h2>

      <div className={cardClasses}>
        <label className={labelClasses}>Email</label>
        <input
          className={inputClasses}
          value={draft.contact.email}
          onChange={(e) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
        />
      </div>

      <BilingualField
        label="Availability"
        en={draft.contact.availability.en}
        ar={draft.contact.availability.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, availability: { ...prev.contact.availability, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, availability: { ...prev.contact.availability, ar: value } } }))}
      />
      <BilingualField
        label="Headline 1"
        en={draft.contact.headline1.en}
        ar={draft.contact.headline1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline1: { ...prev.contact.headline1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline1: { ...prev.contact.headline1, ar: value } } }))}
      />
      <BilingualField
        label="Headline 2"
        en={draft.contact.headline2.en}
        ar={draft.contact.headline2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline2: { ...prev.contact.headline2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline2: { ...prev.contact.headline2, ar: value } } }))}
      />
      <BilingualField
        label="Headline 3"
        en={draft.contact.headline3.en}
        ar={draft.contact.headline3.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline3: { ...prev.contact.headline3, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, headline3: { ...prev.contact.headline3, ar: value } } }))}
      />
      <BilingualField
        label="Body"
        multiline
        en={draft.contact.body.en}
        ar={draft.contact.body.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, body: { ...prev.contact.body, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, body: { ...prev.contact.body, ar: value } } }))}
      />
      <BilingualField
        label="Note"
        multiline
        en={draft.contact.note.en}
        ar={draft.contact.note.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, note: { ...prev.contact.note, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, note: { ...prev.contact.note, ar: value } } }))}
      />
      <BilingualField
        label="Email Label"
        en={draft.contact.emailLabel.en}
        ar={draft.contact.emailLabel.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, emailLabel: { ...prev.contact.emailLabel, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, emailLabel: { ...prev.contact.emailLabel, ar: value } } }))}
      />
      <BilingualField
        label="Sign-off 1"
        multiline
        en={draft.contact.signoff1.en}
        ar={draft.contact.signoff1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff1: { ...prev.contact.signoff1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff1: { ...prev.contact.signoff1, ar: value } } }))}
      />
      <BilingualField
        label="Sign-off 2"
        multiline
        en={draft.contact.signoff2.en}
        ar={draft.contact.signoff2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff2: { ...prev.contact.signoff2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, contact: { ...prev.contact, signoff2: { ...prev.contact.signoff2, ar: value } } }))}
      />

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-white font-bold text-base">Social Links</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={labelClasses}>WhatsApp</label>
            <input
              className={inputClasses}
              value={draft.contact.socials.whatsapp}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, socials: { ...prev.contact.socials, whatsapp: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label className={labelClasses}>LinkedIn</label>
            <input
              className={inputClasses}
              value={draft.contact.socials.linkedin}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, socials: { ...prev.contact.socials, linkedin: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label className={labelClasses}>Behance</label>
            <input
              className={inputClasses}
              value={draft.contact.socials.behance}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, socials: { ...prev.contact.socials, behance: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label className={labelClasses}>Facebook</label>
            <input
              className={inputClasses}
              value={draft.contact.socials.facebook}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, socials: { ...prev.contact.socials, facebook: e.target.value } },
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
