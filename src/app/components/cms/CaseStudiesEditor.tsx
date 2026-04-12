import type { CmsData } from '../../types/cms';

interface CaseStudiesEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeCsId: number;
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

function splitMetricLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [metricValue, labelEn, labelAr] = line.split('|').map((part) => part.trim());
      return {
        value: metricValue || '',
        label: {
          en: labelEn || '',
          ar: labelAr || '',
        },
      };
    });
}

export function CaseStudiesEditor({ draft, updateDraft, activeCsId }: CaseStudiesEditorProps) {
  const index = draft.caseStudies.findIndex((item) => item.id === activeCsId);
  const caseStudy = draft.caseStudies[index] ?? {
    id: activeCsId,
    visible: true,
    title: { en: '', ar: '' },
    tagline: { en: '', ar: '' },
    heroImage: '',
    meta: {
      role: { en: '', ar: '' },
      timeline: '',
      team: { en: '', ar: '' },
      industry: { en: '', ar: '' },
    },
    metrics: [],
  };

  const updateCaseStudy = (updater: (value: typeof caseStudy) => typeof caseStudy) => {
    updateDraft((prev) => {
      const caseStudies = [...prev.caseStudies];
      const currentIndex = caseStudies.findIndex((item) => item.id === activeCsId);
      if (currentIndex >= 0) {
        caseStudies[currentIndex] = updater(caseStudies[currentIndex] as typeof caseStudy);
      } else {
        caseStudies.push(updater(caseStudy));
      }
      return { ...prev, caseStudies };
    });
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ color: '#fff', marginTop: 0 }}>Case Study {activeCsId}</h2>

      <div style={cardStyle}>
        <label style={{ color: '#d3d3dc', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={caseStudy.visible}
            onChange={(e) => updateCaseStudy((current) => ({ ...current, visible: e.target.checked }))}
          />
          Visible in portfolio
        </label>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Title (EN)</label>
            <input
              style={inputStyle}
              value={caseStudy.title.en}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                title: { ...current.title, en: e.target.value },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Title (AR)</label>
            <input
              dir="rtl"
              style={inputStyle}
              value={caseStudy.title.ar}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                title: { ...current.title, ar: e.target.value },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Tagline (EN)</label>
            <textarea
              rows={3}
              style={inputStyle}
              value={caseStudy.tagline.en}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                tagline: { ...current.tagline, en: e.target.value },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Tagline (AR)</label>
            <textarea
              rows={3}
              dir="rtl"
              style={inputStyle}
              value={caseStudy.tagline.ar}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                tagline: { ...current.tagline, ar: e.target.value },
              }))}
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <label style={labelStyle}>Hero Image URL</label>
        <input
          style={inputStyle}
          value={caseStudy.heroImage}
          onChange={(e) => updateCaseStudy((current) => ({ ...current, heroImage: e.target.value }))}
        />
      </div>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Meta</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Role (EN)</label>
            <input
              style={inputStyle}
              value={caseStudy.meta.role.en}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, role: { ...current.meta.role, en: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Role (AR)</label>
            <input
              dir="rtl"
              style={inputStyle}
              value={caseStudy.meta.role.ar}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, role: { ...current.meta.role, ar: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Timeline</label>
            <input
              style={inputStyle}
              value={caseStudy.meta.timeline}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, timeline: e.target.value },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Team (EN)</label>
            <input
              style={inputStyle}
              value={caseStudy.meta.team.en}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, team: { ...current.meta.team, en: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Team (AR)</label>
            <input
              dir="rtl"
              style={inputStyle}
              value={caseStudy.meta.team.ar}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, team: { ...current.meta.team, ar: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Industry (EN)</label>
            <input
              style={inputStyle}
              value={caseStudy.meta.industry.en}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, industry: { ...current.meta.industry, en: e.target.value } },
              }))}
            />
          </div>
          <div>
            <label style={labelStyle}>Industry (AR)</label>
            <input
              dir="rtl"
              style={inputStyle}
              value={caseStudy.meta.industry.ar}
              onChange={(e) => updateCaseStudy((current) => ({
                ...current,
                meta: { ...current.meta, industry: { ...current.meta.industry, ar: e.target.value } },
              }))}
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <p style={{ margin: '0 0 8px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Metrics</p>
        <p style={{ margin: '0 0 10px', color: '#9a9aa8', fontSize: 12 }}>
          One metric per line in format: value|label_en|label_ar
        </p>
        <textarea
          rows={5}
          style={inputStyle}
          value={caseStudy.metrics.map((metric) => `${metric.value}|${metric.label.en}|${metric.label.ar}`).join('\n')}
          onChange={(e) => {
            const metrics = splitMetricLines(e.target.value);
            updateCaseStudy((current) => ({ ...current, metrics }));
          }}
        />
      </div>
    </div>
  );
}
