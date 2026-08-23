import { useState } from 'react';
import type { CmsData, CmsLogo } from '../../../types/cms';
import { Button } from '../../ui/button';
import { cardClasses, inputClasses, labelClasses } from '../../../components/cms/shared/BilingualField';
import { ImageUploader } from '../../../components/cms/shared/ImageUploader';
import { Trash2, Plus, GripVertical, Image as ImageIcon, Check, X } from 'lucide-react';

interface LogoMarqueeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function LogoMarqueeEditor({ draft, updateDraft }: LogoMarqueeEditorProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const addLogo = () => {
    updateDraft((prev) => ({
      ...prev,
      logoMarquee: [
        ...(prev.logoMarquee || []),
        {
          id: Date.now().toString(),
          visible: true,
          name: '',
          url: '',
          href: '',
        },
      ],
    }));
  };

  const removeLogo = (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;
    updateDraft((prev) => ({
      ...prev,
      logoMarquee: prev.logoMarquee.filter((l) => l.id !== id),
    }));
  };

  const updateLogo = (id: string, updater: (logo: CmsLogo) => CmsLogo) => {
    updateDraft((prev) => ({
      ...prev,
      logoMarquee: prev.logoMarquee.map((l) => (l.id === id ? updater(l) : l)),
    }));
  };

  const toggleVisibility = (id: string) => {
    updateLogo(id, (l) => ({ ...l, visible: !l.visible }));
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
      const newLogos = [...prev.logoMarquee];
      const item = newLogos.splice(draggedIdx, 1)[0];
      newLogos.splice(index, 0, item);
      return { ...prev, logoMarquee: newLogos };
    });
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const logos = draft.logoMarquee || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">Logo Marquee</h2>
        <p className="text-white/50 text-sm mt-1">Manage the infinitely scrolling logo strip.</p>
      </div>

      <div className="space-y-4">
        {logos.map((logo, index) => {
          const isDragging = index === draggedIdx;
          return (
            <div
              key={logo.id}
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`${cardClasses} flex flex-col gap-6 transition-all duration-300 ${
                isDragging ? 'opacity-50 scale-[0.98] border-brand shadow-[0_0_20px_rgba(109,79,184,0.2)]' : ''
              } ${!logo.visible ? 'opacity-60 grayscale-[50%]' : ''}`}
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
                    Logo
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 gap-2 border-admin-border-subtle bg-transparent transition-colors ${
                      logo.visible
                        ? 'text-white/70 hover:text-white hover:bg-white/5'
                        : 'text-amber-500 border-amber-500/20 hover:bg-amber-500/10'
                    }`}
                    onClick={() => toggleVisibility(logo.id)}
                  >
                    {logo.visible ? <Check size={14} /> : <X size={14} />}
                    {logo.visible ? 'Visible' : 'Hidden'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-admin-border-subtle bg-transparent text-red-400 hover:text-red-300 hover:border-red-400/30 hover:bg-red-400/10 transition-colors"
                    onClick={() => removeLogo(logo.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Logo Preview & URL */}
                <div className="md:col-span-3 flex flex-col gap-3">
                  <ImageUploader
                    label="Image URL"
                    value={logo.url}
                    onChange={(url) => updateLogo(logo.id, (l) => ({ ...l, url }))}
                    helpText="Tip: SVGs or high-res transparent PNGs work best. Max height 200px."
                  />
                </div>

                <div className="md:col-span-9 flex flex-col gap-6">
                  <div>
                    <label className={labelClasses}>Logo Name (Alt Text)</label>
                    <input
                      type="text"
                      value={logo.name}
                      onChange={(e) => updateLogo(logo.id, (l) => ({ ...l, name: e.target.value }))}
                      className={inputClasses}
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>External Link (Optional)</label>
                    <input
                      type="text"
                      value={logo.href || ''}
                      onChange={(e) => updateLogo(logo.id, (l) => ({ ...l, href: e.target.value }))}
                      className={inputClasses}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {logos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-admin-border-subtle rounded-2xl bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
              <ImageIcon size={24} />
            </div>
            <p className="text-white/60 font-medium mb-1">No logos added</p>
            <p className="text-white/40 text-sm mb-4">Add your first logo to display the marquee strip.</p>
            <Button onClick={addLogo} variant="outline" className="gap-2 border-admin-border-subtle text-white/70">
              <Plus size={16} /> Add Logo
            </Button>
          </div>
        )}

        {logos.length > 0 && (
          <div className="flex justify-center pt-2">
            <Button onClick={addLogo} className="gap-2 bg-brand hover:bg-brand-hover text-white">
              <Plus size={16} /> Add Logo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
