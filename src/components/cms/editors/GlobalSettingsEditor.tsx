import type { CmsData } from '../../../types/cms';
import { BilingualField, splitComma, cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';

interface GlobalSettingsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function GlobalSettingsEditor({ draft, updateDraft }: GlobalSettingsEditorProps) {

  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Global Content Settings</h2>

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-white font-bold text-base">SEO / Owner</p>
        <div className="grid gap-2.5">
          <div>
            <label className={labelClasses}>SEO Title</label>
            <input
              className={inputClasses}
              value={draft.global.seoTitle}
              onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, seoTitle: e.target.value } }))}
            />
          </div>
          <div>
            <label className={labelClasses}>SEO Description</label>
            <textarea
              rows={3}
              className={inputClasses}
              value={draft.global.seoDescription}
              onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, seoDescription: e.target.value } }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClasses}>Owner Name</label>
              <input
                className={inputClasses}
                value={draft.global.ownerName}
                onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, ownerName: e.target.value } }))}
              />
            </div>
            <div>
              <label className={labelClasses}>Owner Email</label>
              <input
                className={inputClasses}
                value={draft.global.ownerEmail}
                onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, ownerEmail: e.target.value } }))}
              />
            </div>
          </div>
          <div>
            <label className={labelClasses}>Footer Tagline</label>
            <input
              className={inputClasses}
              value={draft.global.footerTagline}
              onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, footerTagline: e.target.value } }))}
            />
          </div>
        </div>
      </div>



      <BilingualField
        label="Footer Copyright"
        en={draft.footer.copyright.en}
        ar={draft.footer.copyright.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyright: { ...prev.footer.copyright, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyright: { ...prev.footer.copyright, ar: value } } }))}
      />

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-white font-bold text-base">Footer Links</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={labelClasses}>English links (comma-separated)</label>
            <input
              className={inputClasses}
              value={draft.footer.links.en.join(', ')}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  links: {
                    ...prev.footer.links,
                    en: splitComma(e.target.value),
                  },
                },
              }))}
            />
          </div>
          <div>
            <label className={labelClasses}>Arabic links (comma-separated)</label>
            <input
              dir="rtl"
              className={inputClasses}
              value={draft.footer.links.ar.join(', ')}
              onChange={(e) => updateDraft((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  links: {
                    ...prev.footer.links,
                    ar: splitComma(e.target.value),
                  },
                },
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
