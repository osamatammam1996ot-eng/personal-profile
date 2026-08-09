import type { CmsData } from '../../../types/cms';
import { BilingualField, splitComma, cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';

interface GlobalSettingsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function GlobalSettingsEditor({ draft, updateDraft }: GlobalSettingsEditorProps) {
  const updateDiscipline = (
    index: number,
    updater: (item: CmsData['skills']['disciplines'][number]) => CmsData['skills']['disciplines'][number],
  ) => {
    updateDraft((prev) => {
      const disciplines = [...prev.skills.disciplines];
      const base = disciplines[index] ?? {
        title: { en: '', ar: '' },
        tagline: { en: '', ar: '' },
        tags: { en: [], ar: [] },
      };
      disciplines[index] = updater(base);
      return {
        ...prev,
        skills: {
          ...prev.skills,
          disciplines,
        },
      };
    });
  };

  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Global Content Settings</h2>

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-white font-bold text-[13px]">SEO / Owner</p>
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
        label="Skills Heading 1"
        en={draft.skills.heading1.en}
        ar={draft.skills.heading1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, ar: value } } }))}
      />
      <BilingualField
        label="Skills Heading 2"
        en={draft.skills.heading2.en}
        ar={draft.skills.heading2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, ar: value } } }))}
      />
      <BilingualField
        label="Skills Description"
        multiline
        en={draft.skills.desc.en}
        ar={draft.skills.desc.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, ar: value } } }))}
      />

      {[0, 1, 2].map((index) => {
        const discipline = draft.skills.disciplines[index] ?? {
          title: { en: '', ar: '' },
          tagline: { en: '', ar: '' },
          tags: { en: [], ar: [] },
        };

        return (
          <div key={index} className={cardClasses}>
            <p className="m-0 mb-2.5 text-white font-bold text-[13px]">
              Discipline {index + 1}
            </p>
            <div className="grid gap-2.5">
              <BilingualField
                label="Title"
                en={discipline.title.en}
                ar={discipline.title.ar}
                onChangeEn={(value) => updateDiscipline(index, (current) => ({ ...current, title: { ...current.title, en: value } }))}
                onChangeAr={(value) => updateDiscipline(index, (current) => ({ ...current, title: { ...current.title, ar: value } }))}
              />
              <BilingualField
                label="Tagline"
                multiline
                en={discipline.tagline.en}
                ar={discipline.tagline.ar}
                onChangeEn={(value) => updateDiscipline(index, (current) => ({ ...current, tagline: { ...current.tagline, en: value } }))}
                onChangeAr={(value) => updateDiscipline(index, (current) => ({ ...current, tagline: { ...current.tagline, ar: value } }))}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClasses}>Tags EN (comma-separated)</label>
                  <input
                    className={inputClasses}
                    value={discipline.tags.en.join(', ')}
                    onChange={(e) => updateDiscipline(index, (current) => ({ ...current, tags: { ...current.tags, en: splitComma(e.target.value) } }))}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Tags AR (comma-separated)</label>
                  <input
                    dir="rtl"
                    className={inputClasses}
                    value={discipline.tags.ar.join(', ')}
                    onChange={(e) => updateDiscipline(index, (current) => ({ ...current, tags: { ...current.tags, ar: splitComma(e.target.value) } }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <BilingualField
        label="Tools Title"
        en={draft.tools.title.en}
        ar={draft.tools.title.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, title: { ...prev.tools.title, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, title: { ...prev.tools.title, ar: value } } }))}
      />
      <BilingualField
        label="Tools Description"
        multiline
        en={draft.tools.desc.en}
        ar={draft.tools.desc.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, desc: { ...prev.tools.desc, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, desc: { ...prev.tools.desc, ar: value } } }))}
      />
      <BilingualField
        label="Tools Click Hint"
        en={draft.tools.clickHint.en}
        ar={draft.tools.clickHint.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, clickHint: { ...prev.tools.clickHint, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, clickHint: { ...prev.tools.clickHint, ar: value } } }))}
      />
      <BilingualField
        label="Tools Proficiency Label"
        en={draft.tools.proficiency.en}
        ar={draft.tools.proficiency.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, proficiency: { ...prev.tools.proficiency, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, tools: { ...prev.tools, proficiency: { ...prev.tools.proficiency, ar: value } } }))}
      />

      <BilingualField
        label="Footer Copyright"
        en={draft.footer.copyright.en}
        ar={draft.footer.copyright.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyright: { ...prev.footer.copyright, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyright: { ...prev.footer.copyright, ar: value } } }))}
      />

      <div className={cardClasses}>
        <p className="m-0 mb-2.5 text-white font-bold text-[13px]">Footer Links</p>
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
