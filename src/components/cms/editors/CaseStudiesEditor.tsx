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
        <div className="grid grid-cols-2 gap-3 mb-4">
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="m-0 mb-1 text-text-primary font-bold text-[13px] tracking-wide">Media Gallery</p>
            <p className="m-0 text-brand-hover text-xs">Add image or video URLs to display in the case study slider overlay.</p>
          </div>
          <button
            onClick={handleAddMedia}
            className="flex items-center gap-2 bg-brand/20 hover:bg-brand-gradient text-white border border-brand/50 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(109,79,184,0.4)]"
          >
            <Plus size={14} /> Add Media
          </button>
        </div>

        {caseStudy.media.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border-strong rounded-2xl text-text-muted text-[13px] bg-black/10 hover:bg-black/20 hover:border-brand/50 transition-all">
            No media added yet. Click "Add Media" to start.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {caseStudy.media.map((item, idx) => (
            <div key={item.id} className="bg-admin-glass-card p-7 rounded-[24px] border border-admin-border-subtle flex gap-5 items-start shadow-2xl backdrop-blur-2xl hover:border-admin-border-strong hover:bg-admin-glass-card-hover transition-all duration-300 group">
              
              <div className="flex flex-col gap-1 mt-6">
                <button onClick={() => handleMoveMedia(idx, 'up')} disabled={idx === 0} className={`p-1 bg-transparent border-none ${idx === 0 ? "text-white/10 cursor-default" : "text-text-muted cursor-pointer hover:text-text-primary"}`}>
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => handleMoveMedia(idx, 'down')} disabled={idx === caseStudy.media.length - 1} className={`p-1 bg-transparent border-none ${idx === caseStudy.media.length - 1 ? "text-white/10 cursor-default" : "text-text-muted cursor-pointer hover:text-text-primary"}`}>
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-[120px_1fr] gap-4">
                <div>
                  <label className={labelClasses}>Type</label>
                  <select
                    className={`${inputClasses} h-[50px] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.5%201.75L6%206.25L10.5%201.75%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.5)%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[position:right_20px_center] bg-no-repeat pr-11 cursor-pointer`}
                    value={item.type}
                    onChange={(e) => handleUpdateMedia(idx, 'type', e.target.value)}
                  >
                    <option value="image" className="bg-[#1a1a24]">Image</option>
                    <option value="video" className="bg-[#1a1a24]">Video (MP4/YouTube)</option>
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
                className="bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 p-2 rounded-lg cursor-pointer flex items-center mt-6 transition-all"
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
