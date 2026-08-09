import { useState } from 'react';
import { Button } from '../../ui/button';
import type { CmsData } from '../../../types/cms';
import { Trash2, Plus } from 'lucide-react';

import { cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';
interface CaseStudiesEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeCsId: number;
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
  color: active ? '#818cf8' : '#a1a1aa',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  whiteSpace: 'nowrap',
});

const defaultBilingual = { en: '', ar: '' };

type FieldDef =
  | { type: 'string'; key: string; label: string }
  | { type: 'bilingual'; key: string; label: string }
  | { type: 'bilingual-textarea'; key: string; label: string }
  | { type: 'select'; key: string; label: string; options: string[] }
  | { type: 'bilingual-array'; key: string; label: string };

export function CaseStudiesEditor({ draft, updateDraft, activeCsId }: CaseStudiesEditorProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const index = draft.caseStudies.findIndex((item: any) => item.id === activeCsId);
  const rawCaseStudy = draft.caseStudies[index];

  const caseStudy = {
    id: activeCsId,
    visible: rawCaseStudy?.visible ?? true,
    title: rawCaseStudy?.title || { ...defaultBilingual },
    tagline: rawCaseStudy?.tagline || { ...defaultBilingual },
    heroImage: rawCaseStudy?.heroImage || '',
    meta: rawCaseStudy?.meta || { role: { ...defaultBilingual }, timeline: { ...defaultBilingual }, team: { ...defaultBilingual }, industry: { ...defaultBilingual } },
    metrics: rawCaseStudy?.metrics || [],
    problem: rawCaseStudy?.problem || { narrative: { ...defaultBilingual }, painPoints: [] },
    research: rawCaseStudy?.research || { methods: { en: [], ar: [] }, insights: [], findings: { en: [], ar: [] } },
    process: rawCaseStudy?.process || { steps: [], tradeoffs: [] },
    solution: rawCaseStudy?.solution || { screens: [] },
    screenshots: rawCaseStudy?.screenshots || [],
    video: rawCaseStudy?.video || { url: '', youtubeId: '', aspectRatio: '16:9', title: { ...defaultBilingual }, desc: { ...defaultBilingual }, duration: '' },
    results: rawCaseStudy?.results || { metrics: [], quote: { text: { ...defaultBilingual }, author: { ...defaultBilingual }, role: { ...defaultBilingual } } },
    reflection: rawCaseStudy?.reflection || { summary: { ...defaultBilingual }, lessons: { en: [], ar: [] }, next: { en: [], ar: [] } },
    settings: rawCaseStudy?.settings || { showProblem: true, showResearch: true, showProcess: true, showSolution: true, showMedia: true, showResults: true, showReflection: true },
    labels: rawCaseStudy?.labels || {
      overview: { en: 'Overview', ar: 'نظرة عامة' },
      problem: { en: 'The Problem', ar: 'المشكلة' },
      research: { en: 'Research & Discovery', ar: 'البحث والاكتشاف' },
      process: { en: 'Design Process', ar: 'عملية التصميم' },
      solution: { en: 'The Solution', ar: 'الحل' },
      media: { en: 'Walkthrough', ar: 'جولة' },
      results: { en: 'Results & Impact', ar: 'النتائج والأثر' },
      reflection: { en: 'Reflection', ar: 'تأملات' }
    }
  };

  const updateCaseStudy = (updater: (value: typeof caseStudy) => typeof caseStudy) => {
    updateDraft((prev) => {
      const caseStudies = [...prev.caseStudies];
      const currentIndex = caseStudies.findIndex((item: any) => item.id === activeCsId);
      if (currentIndex >= 0) {
        caseStudies[currentIndex] = updater(caseStudies[currentIndex] as typeof caseStudy);
      } else {
        caseStudies.push(updater(caseStudy));
      }
      return { ...prev, caseStudies };
    });
  };

  const TABS = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'problem', label: 'Problem & Research' },
    { id: 'process', label: 'Process' },
    { id: 'solution', label: 'Solution & Media' },
    { id: 'results', label: 'Results & Reflection' },
    { id: 'settings', label: 'Settings & Labels' },
  ];

  const renderBilingualField = (label: string, fieldPath: string[], isTextArea = false) => {
    const getValue = (lang: 'en' | 'ar') => {
      let val = caseStudy as any;
      for (const key of fieldPath) val = val?.[key];
      return val?.[lang] || '';
    };

    const updateValue = (lang: 'en' | 'ar', newVal: string) => {
      updateCaseStudy(current => {
        const copy = JSON.parse(JSON.stringify(current));
        let obj = copy;
        for (let i = 0; i < fieldPath.length - 1; i++) {
          if (!obj[fieldPath[i]]) obj[fieldPath[i]] = {};
          obj = obj[fieldPath[i]];
        }
        if (!obj[fieldPath[fieldPath.length - 1]]) obj[fieldPath[fieldPath.length - 1]] = { en: '', ar: '' };
        obj[fieldPath[fieldPath.length - 1]][lang] = newVal;
        return copy;
      });
    };

    const InputType = isTextArea ? 'textarea' as any : 'input';

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div>
          <label className={labelClasses}>{label} (EN)</label>
          <InputType
            className={inputClasses}
            rows={isTextArea ? 3 : undefined}
            value={getValue('en')}
            onChange={(e: any) => updateValue('en', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>{label} (AR)</label>
          <InputType
            className={inputClasses}
            dir="rtl"
            rows={isTextArea ? 3 : undefined}
            value={getValue('ar')}
            onChange={(e: any) => updateValue('ar', e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderToggle = (label: string, fieldPath: keyof typeof caseStudy.settings) => (
    <label style={{ color: '#d3d3dc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <input
        type="checkbox"
        checked={caseStudy.settings[fieldPath]}
        onChange={(e) => updateCaseStudy(c => ({ ...c, settings: { ...c.settings, [fieldPath]: e.target.checked } }))}
      />
      {label}
    </label>
  );

  const renderArrayEditor = (label: string, hint: string, fieldPath: string[], schema: FieldDef[]) => {
    const getArrayValue = (): any[] => {
      let val = caseStudy as any;
      for (const key of fieldPath) val = val?.[key];
      return Array.isArray(val) ? val : [];
    };

    const updateArrayValue = (newArr: any[]) => {
      updateCaseStudy(current => {
        const copy = JSON.parse(JSON.stringify(current));
        let obj = copy;
        for (let i = 0; i < fieldPath.length - 1; i++) {
          if (!obj[fieldPath[i]]) obj[fieldPath[i]] = {};
          obj = obj[fieldPath[i]];
        }
        obj[fieldPath[fieldPath.length - 1]] = newArr;
        return copy;
      });
    };

    const handleAddItem = () => {
      const arr = [...getArrayValue()];
      const newItem: any = {};
      schema.forEach(field => {
        if (field.type === 'string' || field.type === 'select') newItem[field.key] = '';
        else if (field.type === 'bilingual' || field.type === 'bilingual-textarea') newItem[field.key] = { en: '', ar: '' };
        else if (field.type === 'bilingual-array') newItem[field.key] = { en: [], ar: [] };
      });
      arr.push(newItem);
      updateArrayValue(arr);
    };

    const handleRemoveItem = (index: number) => {
      const arr = [...getArrayValue()];
      arr.splice(index, 1);
      updateArrayValue(arr);
    };

    const handleUpdateItem = (index: number, key: string, lang: 'en' | 'ar' | 'flat', val: any) => {
      const arr = JSON.parse(JSON.stringify(getArrayValue()));
      const item = arr[index];
      if (lang === 'flat') {
        item[key] = val;
      } else {
        if (!item[key]) item[key] = { en: '', ar: '' };
        item[key][lang] = val;
      }
      updateArrayValue(arr);
    };

    const items = getArrayValue();

    return (
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: 700, fontSize: 13 }}>{label}</p>
            {hint && <p style={{ margin: 0, color: '#a5b4fc', fontSize: 12 }}>{hint}</p>}
          </div>
          <button
            onClick={handleAddItem}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        {items.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, color: '#a1a1aa', fontSize: 13 }}>
            No items added yet. Click "Add Item" to start.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: 6, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Remove Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gap: 16, paddingRight: 32 }}>
                {schema.map(field => {
                  if (field.type === 'string') {
                    return (
                      <div key={field.key}>
                        <label className={labelClasses}>{field.label}</label>
                        <input
                          className={inputClasses}
                          value={item[field.key] || ''}
                          onChange={e => handleUpdateItem(idx, field.key, 'flat', e.target.value)}
                        />
                      </div>
                    );
                  }
                  if (field.type === 'select') {
                    return (
                      <div key={field.key}>
                        <label className={labelClasses}>{field.label}</label>
                        <select
                          className={inputClasses}
                          value={item[field.key] || ''}
                          onChange={e => handleUpdateItem(idx, field.key, 'flat', e.target.value)}
                        >
                          <option value="">Select...</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === 'bilingual' || field.type === 'bilingual-textarea') {
                    const InputType = field.type === 'bilingual-textarea' ? 'textarea' as any : 'input';
                    return (
                      <div key={field.key}>
                        <label className={labelClasses}>{field.label}</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <InputType
                            className={inputClasses}
                            rows={field.type === 'bilingual-textarea' ? 3 : undefined}
                            placeholder="English"
                            value={item[field.key]?.en || ''}
                            onChange={(e: any) => handleUpdateItem(idx, field.key, 'en', e.target.value)}
                          />
                          <InputType
                            className={inputClasses}
                            dir="rtl"
                            rows={field.type === 'bilingual-textarea' ? 3 : undefined}
                            placeholder="Arabic"
                            value={item[field.key]?.ar || ''}
                            onChange={(e: any) => handleUpdateItem(idx, field.key, 'ar', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  }
                  if (field.type === 'bilingual-array') {
                    return (
                      <div key={field.key}>
                        <label className={labelClasses}>{field.label} (Comma separated)</label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            className={inputClasses}
                            placeholder="English"
                            value={(item[field.key]?.en || []).join(', ')}
                            onChange={(e: any) => handleUpdateItem(idx, field.key, 'en', e.target.value.split(',').map((s: string) => s.trim()))}
                          />
                          <input
                            className={inputClasses}
                            dir="rtl"
                            placeholder="Arabic"
                            value={(item[field.key]?.ar || []).join(', ')}
                            onChange={(e: any) => handleUpdateItem(idx, field.key, 'ar', e.target.value.split(',').map((s: string) => s.trim()))}
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Case Study {activeCsId}</h2>
      
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={tabStyle(activeTab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={cardClasses}>
        <label style={{ color: '#d3d3dc', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={caseStudy.visible}
            onChange={(e) => updateCaseStudy((c) => ({ ...c, visible: e.target.checked }))}
          />
          Visible in portfolio
        </label>
      </div>

      {activeTab === 'basic' && (
        <div className={cardClasses}>
          {renderBilingualField('Title', ['title'])}
          {renderBilingualField('Tagline', ['tagline'], true)}
          <div style={{ marginBottom: 16 }}>
            <label className={labelClasses}>Hero Image URL (Recommended: 16:9)</label>
            <input className={inputClasses} value={caseStudy.heroImage} onChange={e => updateCaseStudy(c => ({...c, heroImage: e.target.value}))} />
          </div>
          <p className="m-0 mt-5 mb-2.5 text-white font-bold text-[13px]">Meta Information</p>
          {renderBilingualField('Role', ['meta', 'role'])}
          {renderBilingualField('Timeline', ['meta', 'timeline'])}
          {renderBilingualField('Team', ['meta', 'team'])}
          {renderBilingualField('Industry', ['meta', 'industry'])}
        </div>
      )}

      {activeTab === 'problem' && (
        <div className={cardClasses}>
          <p className="m-0 mb-2.5 text-white font-bold text-[13px]">Problem Narrative</p>
          {renderBilingualField('Narrative', ['problem', 'narrative'], true)}
          
          <p className="m-0 mt-5 mb-2.5 text-white font-bold text-[13px]">Research Methods</p>
          <div style={{ marginBottom: 16 }}>
            <label className={labelClasses}>Methods (comma separated) (EN/AR)</label>
            <div className="grid grid-cols-2 gap-2.5">
              <input className={inputClasses} value={(caseStudy.research?.methods?.en || []).join(', ')} onChange={e => updateCaseStudy(c => { const c2 = JSON.parse(JSON.stringify(c)); if(!c2.research) c2.research={}; if(!c2.research.methods) c2.research.methods={}; c2.research.methods.en = e.target.value.split(',').map((s: string)=>s.trim()); return c2; })} />
              <input className={inputClasses} dir="rtl" value={(caseStudy.research?.methods?.ar || []).join(', ')} onChange={e => updateCaseStudy(c => { const c2 = JSON.parse(JSON.stringify(c)); if(!c2.research) c2.research={}; if(!c2.research.methods) c2.research.methods={}; c2.research.methods.ar = e.target.value.split(',').map((s: string)=>s.trim()); return c2; })} />
            </div>
          </div>
          
          {renderArrayEditor('Pain Points', 'List the user pain points.', ['problem', 'painPoints'], [
            { type: 'string', key: 'icon', label: 'Icon (e.g. target, users, zap)' },
            { type: 'bilingual', key: 'title', label: 'Pain Point Title' },
            { type: 'bilingual-textarea', key: 'desc', label: 'Description' }
          ])}
          
          {renderArrayEditor('Insights', 'Key quotes from research.', ['research', 'insights'], [
            { type: 'string', key: 'id', label: 'Insight ID (e.g. 1, 2)' },
            { type: 'bilingual-textarea', key: 'quote', label: 'Quote' },
            { type: 'bilingual', key: 'author', label: 'Author/Role' },
            { type: 'bilingual', key: 'theme', label: 'Theme (e.g. Accessibility)' }
          ])}
        </div>
      )}

      {activeTab === 'process' && (
        <div className={cardClasses}>
          {renderArrayEditor('Process Steps', 'Steps taken during design/development.', ['process', 'steps'], [
            { type: 'string', key: 'phase', label: 'Phase (e.g. Discovery, Ideation)' },
            { type: 'bilingual', key: 'title', label: 'Step Title' },
            { type: 'bilingual', key: 'duration', label: 'Duration (e.g. 2 weeks)' },
            { type: 'bilingual-textarea', key: 'desc', label: 'Description' }
          ])}
          {renderArrayEditor('Tradeoffs', 'Design decisions and rationale.', ['process', 'tradeoffs'], [
            { type: 'bilingual', key: 'decision', label: 'Decision Made' },
            { type: 'bilingual-textarea', key: 'rationale', label: 'Rationale' }
          ])}
        </div>
      )}

      {activeTab === 'solution' && (
        <div className={cardClasses}>
          {renderArrayEditor('Solution Screens', 'Showcase major screens of the final product.', ['solution', 'screens'], [
            { type: 'bilingual', key: 'title', label: 'Screen Title' },
            { type: 'bilingual-textarea', key: 'desc', label: 'Description' },
            { type: 'string', key: 'image', label: 'Image URL' },
            { type: 'select', key: 'align', label: 'Alignment (Image left or right)', options: ['left', 'right'] },
            { type: 'bilingual-array', key: 'callouts', label: 'Callout Features' }
          ])}
          
          <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="m-0 mb-2.5 text-white font-bold text-[13px]">Video Walkthrough</p>
            <div style={{ marginBottom: 16 }}>
              <label className={labelClasses}>MP4 Video URL (Recommended: 16:9)</label>
              <input className={inputClasses} value={caseStudy.video?.url || ''} onChange={e => updateCaseStudy(c => { const c2 = JSON.parse(JSON.stringify(c)); if(!c2.video) c2.video={}; c2.video.url = e.target.value; return c2; })} placeholder="https://example.com/video.mp4" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className={labelClasses}>OR YouTube ID</label>
              <input className={inputClasses} value={caseStudy.video?.youtubeId || ''} onChange={e => updateCaseStudy(c => { const c2 = JSON.parse(JSON.stringify(c)); if(!c2.video) c2.video={}; c2.video.youtubeId = e.target.value; return c2; })} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className={labelClasses}>Video Duration (e.g. 2:45)</label>
              <input className={inputClasses} value={caseStudy.video?.duration || ''} onChange={e => updateCaseStudy(c => { const c2 = JSON.parse(JSON.stringify(c)); if(!c2.video) c2.video={}; c2.video.duration = e.target.value; return c2; })} />
            </div>
            {renderBilingualField('Video Title', ['video', 'title'])}
          </div>
          
          <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {renderArrayEditor('Screenshots Gallery', 'Additional screenshots of the product.', ['screenshots'], [
              { type: 'string', key: 'image', label: 'Image URL' },
              { type: 'bilingual', key: 'caption', label: 'Caption' },
              { type: 'bilingual', key: 'tag', label: 'Tag (e.g. iOS, Web)' }
            ])}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className={cardClasses}>
          {renderArrayEditor('Results Metrics', 'Quantifiable outcomes.', ['results', 'metrics'], [
            { type: 'string', key: 'value', label: 'Value (e.g. +40%)' },
            { type: 'bilingual', key: 'label', label: 'Metric Label' },
            { type: 'bilingual', key: 'sub', label: 'Subtext / Context' }
          ])}
          <p className="m-0 mt-5 mb-2.5 text-white font-bold text-[13px]">Testimonial Quote</p>
          {renderBilingualField('Quote Text', ['results', 'quote', 'text'], true)}
          {renderBilingualField('Author', ['results', 'quote', 'author'])}
          {renderBilingualField('Role', ['results', 'quote', 'role'])}

          <p className="m-0 mt-5 mb-2.5 text-white font-bold text-[13px]">Reflection</p>
          {renderBilingualField('Summary', ['reflection', 'summary'], true)}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className={cardClasses}>
          <p style={{ margin: '0 0 16px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Section Visibility</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div>
              {renderToggle('Show Problem Section', 'showProblem')}
              {renderToggle('Show Research Section', 'showResearch')}
              {renderToggle('Show Process Section', 'showProcess')}
              {renderToggle('Show Solution Section', 'showSolution')}
            </div>
            <div>
              {renderToggle('Show Media Section', 'showMedia')}
              {renderToggle('Show Results Section', 'showResults')}
              {renderToggle('Show Reflection Section', 'showReflection')}
            </div>
          </div>

          <p style={{ margin: '0 0 16px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Custom Section Labels</p>
          {renderBilingualField('Overview Label', ['labels', 'overview'])}
          {renderBilingualField('Problem Label', ['labels', 'problem'])}
          {renderBilingualField('Research Label', ['labels', 'research'])}
          {renderBilingualField('Process Label', ['labels', 'process'])}
          {renderBilingualField('Solution Label', ['labels', 'solution'])}
          {renderBilingualField('Media Label', ['labels', 'media'])}
          {renderBilingualField('Results Label', ['labels', 'results'])}
          {renderBilingualField('Reflection Label', ['labels', 'reflection'])}
        </div>
      )}

    </div>
  );
}
