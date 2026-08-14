import { Button } from '../../ui/button';
import type { CmsData } from '../../../types/cms';
import { Trash2, Plus, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';

interface CaseStudiesEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeCsId: number;
}

export function CaseStudiesEditor({ draft, updateDraft, activeCsId }: CaseStudiesEditorProps) {
  const index = draft.caseStudies.findIndex((item: any) => item.id === activeCsId);
  const rawCaseStudy = draft.caseStudies[index];

  // Fallback structure in case it's missing or legacy
  const caseStudy = {
    id: activeCsId,
    visible: rawCaseStudy?.visible ?? true,
    title: rawCaseStudy?.title || { en: '', ar: '' },
    media: rawCaseStudy?.media || [],
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

  const handleAddMedia = () => {
    updateCaseStudy((c) => ({
      ...c,
      media: [
        ...(c.media || []),
        { id: Math.random().toString(36).substring(7), type: 'image', url: '' }
      ]
    }));
  };

  const handleRemoveMedia = (idx: number) => {
    updateCaseStudy((c) => {
      const newMedia = [...(c.media || [])];
      newMedia.splice(idx, 1);
      return { ...c, media: newMedia };
    });
  };

  const handleMoveMedia = (idx: number, direction: 'up' | 'down') => {
    updateCaseStudy((c) => {
      const newMedia = [...(c.media || [])];
      if (direction === 'up' && idx > 0) {
        [newMedia[idx - 1], newMedia[idx]] = [newMedia[idx], newMedia[idx - 1]];
      } else if (direction === 'down' && idx < newMedia.length - 1) {
        [newMedia[idx], newMedia[idx + 1]] = [newMedia[idx + 1], newMedia[idx]];
      }
      return { ...c, media: newMedia };
    });
  };

  const handleUpdateMedia = (idx: number, field: 'type' | 'url', value: string) => {
    updateCaseStudy((c) => {
      const newMedia = [...(c.media || [])];
      newMedia[idx] = { ...newMedia[idx], [field]: value };
      return { ...c, media: newMedia };
    });
  };

  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0 mb-4">Case Study {activeCsId} — Media Gallery</h2>

      <div className={cardClasses}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div>
            <label className={labelClasses}>Project Title (EN)</label>
            <input
              className={inputClasses}
              value={caseStudy.title.en}
              onChange={(e) => updateCaseStudy((c) => ({ ...c, title: { ...c.title, en: e.target.value } }))}
            />
          </div>
          <div>
            <label className={labelClasses}>Project Title (AR)</label>
            <input
              className={inputClasses}
              dir="rtl"
              value={caseStudy.title.ar}
              onChange={(e) => updateCaseStudy((c) => ({ ...c, title: { ...c.title, ar: e.target.value } }))}
            />
          </div>
        </div>
      </div>

      <div className={cardClasses}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: 700, fontSize: 13 }}>Media Gallery</p>
            <p style={{ margin: 0, color: '#a5b4fc', fontSize: 12 }}>Add image or video URLs to display in the case study slider overlay.</p>
          </div>
          <button
            onClick={handleAddMedia}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={14} /> Add Media
          </button>
        </div>

        {caseStudy.media.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, color: '#a1a1aa', fontSize: 13 }}>
            No media added yet. Click "Add Media" to start.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {caseStudy.media.map((item, idx) => (
            <div key={item.id} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 24 }}>
                <button onClick={() => handleMoveMedia(idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.1)' : '#a1a1aa', cursor: idx === 0 ? 'default' : 'pointer', padding: 2 }}>
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => handleMoveMedia(idx, 'down')} disabled={idx === caseStudy.media.length - 1} style={{ background: 'none', border: 'none', color: idx === caseStudy.media.length - 1 ? 'rgba(255,255,255,0.1)' : '#a1a1aa', cursor: idx === caseStudy.media.length - 1 ? 'default' : 'pointer', padding: 2 }}>
                  <ChevronDown size={16} />
                </button>
              </div>

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
                <div>
                  <label className={labelClasses}>Type</label>
                  <select
                    className={inputClasses}
                    value={item.type}
                    onChange={(e) => handleUpdateMedia(idx, 'type', e.target.value)}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video (MP4/YouTube)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>URL</label>
                  <input
                    className={inputClasses}
                    placeholder={item.type === 'image' ? 'https://example.com/image.png' : 'https://example.com/video.mp4'}
                    value={item.url}
                    onChange={(e) => handleUpdateMedia(idx, 'url', e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveMedia(idx)}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: 6, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: 24 }}
                title="Remove Media"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
