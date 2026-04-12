import type { CmsData } from '../../types/cms';

interface GlobalSettingsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.2)',
  color: '#fff',
  padding: '10px 12px',
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#c7c7d0',
  marginBottom: 6,
  display: 'block',
};

function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function BilingualField({
  label,
  en,
  ar,
  multiline,
  onChangeEn,
  onChangeAr,
}: {
  label: string;
  en: string;
  ar: string;
  multiline?: boolean;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
}) {
  const Control = multiline ? 'textarea' : 'input';
  const extra = multiline ? { rows: 3 } : {};

  return (
    <div style={cardStyle}>
      <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>{label}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>English</label>
          <Control {...extra} style={inputStyle} value={en} onChange={(e) => onChangeEn(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Arabic</label>
          <Control {...extra} style={inputStyle} dir="rtl" value={ar} onChange={(e) => onChangeAr(e.target.value)} />
        </div>
      </div>
    </div>
  );
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
    <div style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ color: '#fff', marginTop: 0 }}>Global Content Settings</h2>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>SEO / Owner</p>
        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <label style={labelStyle}>SEO Title</label>
            <input
              style={inputStyle}
              value={draft.global.seoTitle}
              onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, seoTitle: e.target.value } }))}
            />
          </div>
          <div>
            <label style={labelStyle}>SEO Description</label>
            <textarea
              rows={3}
              style={inputStyle}
              value={draft.global.seoDescription}
              onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, seoDescription: e.target.value } }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Owner Name</label>
              <input
                style={inputStyle}
                value={draft.global.ownerName}
                onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, ownerName: e.target.value } }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Owner Email</label>
              <input
                style={inputStyle}
                value={draft.global.ownerEmail}
                onChange={(e) => updateDraft((prev) => ({ ...prev, global: { ...prev.global, ownerEmail: e.target.value } }))}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Footer Tagline</label>
            <input
              style={inputStyle}
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
          <div key={index} style={cardStyle}>
            <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>
              Discipline {index + 1}
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Tags EN (comma-separated)</label>
                  <input
                    style={inputStyle}
                    value={discipline.tags.en.join(', ')}
                    onChange={(e) => updateDiscipline(index, (current) => ({ ...current, tags: { ...current.tags, en: splitComma(e.target.value) } }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tags AR (comma-separated)</label>
                  <input
                    dir="rtl"
                    style={inputStyle}
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

      <div style={cardStyle}>
        <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Footer Links</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>English links (comma-separated)</label>
            <input
              style={inputStyle}
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
            <label style={labelStyle}>Arabic links (comma-separated)</label>
            <input
              dir="rtl"
              style={inputStyle}
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
