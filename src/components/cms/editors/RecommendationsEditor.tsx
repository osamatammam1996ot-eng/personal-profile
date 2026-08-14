import { useState } from 'react';
import type { CmsData, CmsRecommendation } from '../../../types/cms';
import { Button } from '../../ui/button';
import { BilingualField, cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';
import { Trash2, Plus, GripVertical, Image as ImageIcon, Check, X } from 'lucide-react';

interface RecommendationsEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function RecommendationsEditor({ draft, updateDraft }: RecommendationsEditorProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const addRecommendation = () => {
    updateDraft((prev) => ({
      ...prev,
      recommendations: [
        ...prev.recommendations,
        {
          id: Date.now().toString(),
          visible: true,
          name: '',
          position: { en: '', ar: '' },
          comment: { en: '', ar: '' },
          avatar: '',
        },
      ],
    }));
  };

  const removeRecommendation = (id: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    updateDraft((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((r) => r.id !== id),
    }));
  };

  const updateRecommendation = (id: string, updater: (rec: CmsRecommendation) => CmsRecommendation) => {
    updateDraft((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((r) => (r.id === id ? updater(r) : r)),
    }));
  };

  const toggleVisibility = (id: string) => {
    updateRecommendation(id, (r) => ({ ...r, visible: !r.visible }));
  };

  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIdx(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', '');
    }
  };

  const handleDragEnter = (index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;

    updateDraft((prev) => {
      const newRecs = [...prev.recommendations];
      const item = newRecs.splice(draggedIdx, 1)[0];
      newRecs.splice(index, 0, item);
      return { ...prev, recommendations: newRecs };
    });
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold tracking-tight">Recommendations</h2>
          <p className="text-white/50 text-sm mt-1">Manage testimonials displayed in the Voices in Orbit section.</p>
        </div>
        <Button onClick={addRecommendation} className="gap-2 bg-brand hover:bg-brand-hover text-white">
          <Plus size={16} /> Add Recommendation
        </Button>
      </div>

      <div className="space-y-4">
        {draft.recommendations.map((rec, index) => {
          const isDragging = index === draggedIdx;
          return (
            <div
              key={rec.id}
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`${cardClasses} flex flex-col gap-6 transition-all duration-300 ${
                isDragging ? 'opacity-50 scale-[0.98] border-brand shadow-[0_0_20px_rgba(109,79,184,0.2)]' : ''
              } ${!rec.visible ? 'opacity-60 grayscale-[50%]' : ''}`}
            >
              <div className="flex items-center justify-between border-b border-admin-border-subtle pb-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70 transition-colors p-1">
                    <GripVertical size={18} />
                  </div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-white/5 text-white/50 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    Recommendation
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 gap-2 border-admin-border-subtle bg-transparent transition-colors ${
                      rec.visible
                        ? 'text-white/70 hover:text-white hover:bg-white/5'
                        : 'text-amber-500 border-amber-500/20 hover:bg-amber-500/10'
                    }`}
                    onClick={() => toggleVisibility(rec.id)}
                  >
                    {rec.visible ? <Check size={14} /> : <X size={14} />}
                    {rec.visible ? 'Visible' : 'Hidden'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-admin-border-subtle bg-transparent text-red-400 hover:text-red-300 hover:border-red-400/30 hover:bg-red-400/10 transition-colors"
                    onClick={() => removeRecommendation(rec.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Avatar Preview & URL */}
                <div className="md:col-span-3 flex flex-col gap-3">
                  <label className={labelClasses}>Avatar Image</label>
                  <div className="aspect-square rounded-xl bg-white/5 border border-admin-border-subtle overflow-hidden relative group flex items-center justify-center">
                    {rec.avatar ? (
                      <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-white/20" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={rec.avatar}
                    onChange={(e) => updateRecommendation(rec.id, (r) => ({ ...r, avatar: e.target.value }))}
                    className={inputClasses}
                    placeholder="Image URL..."
                  />
                </div>

                <div className="md:col-span-9 flex flex-col gap-6">
                  <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      value={rec.name}
                      onChange={(e) => updateRecommendation(rec.id, (r) => ({ ...r, name: e.target.value }))}
                      className={inputClasses}
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>

                  <BilingualField
                    label="Position / Job Title"
                    en={rec.position.en}
                    ar={rec.position.ar}
                    onChangeEn={(val) => updateRecommendation(rec.id, (r) => ({ ...r, position: { ...r.position, en: val } }))}
                    onChangeAr={(val) => updateRecommendation(rec.id, (r) => ({ ...r, position: { ...r.position, ar: val } }))}
                  />

                  <BilingualField
                    label="Recommendation Comment"
                    en={rec.comment.en}
                    ar={rec.comment.ar}
                    onChangeEn={(val) => updateRecommendation(rec.id, (r) => ({ ...r, comment: { ...r.comment, en: val } }))}
                    onChangeAr={(val) => updateRecommendation(rec.id, (r) => ({ ...r, comment: { ...r.comment, ar: val } }))}
                    multiline
                  />
                </div>
              </div>
            </div>
          );
        })}

        {draft.recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-admin-border-subtle rounded-2xl bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
              <ImageIcon size={24} />
            </div>
            <p className="text-white/60 font-medium mb-1">No recommendations yet</p>
            <p className="text-white/40 text-sm mb-4">Add your first recommendation to show on the portfolio.</p>
            <Button onClick={addRecommendation} variant="outline" className="gap-2 border-admin-border-subtle text-white/70">
              <Plus size={16} /> Add Recommendation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
