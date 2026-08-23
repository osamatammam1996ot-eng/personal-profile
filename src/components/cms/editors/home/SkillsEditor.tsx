import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses, labelClasses, inputClasses, splitComma, TagInput } from '../../../../components/cms/shared/BilingualField';

interface SkillsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function SkillsEditor({ draft, updateDraft }: SkillsEditorProps) {
  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Skills Section</h2>
      <BilingualField
        label="Heading 1"
        en={draft.skills.heading1.en}
        ar={draft.skills.heading1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading1: { ...prev.skills.heading1, ar: value } } }))}
      />
      <BilingualField
        label="Heading 2"
        en={draft.skills.heading2.en}
        ar={draft.skills.heading2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, heading2: { ...prev.skills.heading2, ar: value } } }))}
      />
      <BilingualField
        label="Description"
        multiline
        en={draft.skills.desc.en}
        ar={draft.skills.desc.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, skills: { ...prev.skills, desc: { ...prev.skills.desc, ar: value } } }))}
      />

      {[0, 1, 2].map((index) => {
        const disc = draft.skills.disciplines[index] ?? {
          title: { en: '', ar: '' },
          tagline: { en: '', ar: '' },
          tags: { en: [], ar: [] },
        };
        return (
          <div key={index} className={cardClasses}>
            <p className="m-0 mb-2.5 text-white font-bold text-base">Discipline {index + 1}</p>
            <div className="grid gap-2.5">
              <BilingualField
                label="Title"
                en={disc.title.en}
                ar={disc.title.ar}
                onChangeEn={(value) => updateDraft((prev) => {
                  const d = [...prev.skills.disciplines];
                  d[index] = { ...d[index], title: { ...d[index].title, en: value } };
                  return { ...prev, skills: { ...prev.skills, disciplines: d } };
                })}
                onChangeAr={(value) => updateDraft((prev) => {
                  const d = [...prev.skills.disciplines];
                  d[index] = { ...d[index], title: { ...d[index].title, ar: value } };
                  return { ...prev, skills: { ...prev.skills, disciplines: d } };
                })}
              />
              <BilingualField
                label="Tagline"
                multiline
                en={disc.tagline.en}
                ar={disc.tagline.ar}
                onChangeEn={(value) => updateDraft((prev) => {
                  const d = [...prev.skills.disciplines];
                  d[index] = { ...d[index], tagline: { ...d[index].tagline, en: value } };
                  return { ...prev, skills: { ...prev.skills, disciplines: d } };
                })}
                onChangeAr={(value) => updateDraft((prev) => {
                  const d = [...prev.skills.disciplines];
                  d[index] = { ...d[index], tagline: { ...d[index].tagline, ar: value } };
                  return { ...prev, skills: { ...prev.skills, disciplines: d } };
                })}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <TagInput
                  label="English tags (comma-separated)"
                  value={disc.tags?.en || []}
                  onChange={(val) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], tags: { ...d[index].tags, en: val } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                />
                <TagInput
                  label="Arabic tags (comma-separated)"
                  dir="rtl"
                  value={disc.tags?.ar || []}
                  onChange={(val) => updateDraft((prev) => {
                    const d = [...prev.skills.disciplines];
                    d[index] = { ...d[index], tags: { ...d[index].tags, ar: val } };
                    return { ...prev, skills: { ...prev.skills, disciplines: d } };
                  })}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
