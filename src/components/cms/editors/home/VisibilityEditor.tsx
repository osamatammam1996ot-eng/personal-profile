import type { CmsData } from '../../../../types/cms';
import { useState } from 'react';
import { cardClasses } from '../../../../components/cms/shared/BilingualField';

interface VisibilityEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
}

export function VisibilityEditor({ draft, updateDraft }: VisibilityEditorProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const defaultOrder = ['hero', 'logoMarquee', 'whyHireMe', 'skills', 'portfolio', 'recommendations', 'tools', 'contact', 'footer'];
  const currentOrder = draft.sectionOrder || defaultOrder;

  const labelMap: Record<string, string> = {
    hero: 'Hero',
    logoMarquee: 'Logo Marquee',
    whyHireMe: 'Why Hire Me',
    skills: 'Skills',
    portfolio: 'Portfolio',
    recommendations: 'Recommendations',
    tools: 'Tools',
    contact: 'Contact',
    footer: 'Footer'
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
    
    updateDraft(prev => {
      const newOrder = [...(prev.sectionOrder || defaultOrder)];
      const item = newOrder.splice(draggedIdx, 1)[0];
      newOrder.splice(index, 0, item);
      return { ...prev, sectionOrder: newOrder };
    });
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div>
      <h2 className="text-white mt-0">Section Visibility & Order</h2>
      <p className="text-text-muted mt-0">Toggle any section on/off, and drag them to reorder your homepage.</p>
      <div className="flex flex-col gap-2 max-w-[400px]">
        {currentOrder.map((key, index) => {
          const sectionKey = key as keyof CmsData['sections'];
          const isDragging = index === draggedIdx;
          return (
            <div 
              key={key} 
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`${cardClasses} flex items-center px-4 py-3 transition-all duration-200 ${isDragging ? "cursor-grabbing opacity-30 scale-[0.98] border-brand border-dashed" : "cursor-grab scale-100 border-border-default/30"}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex text-brand hover:text-brand-hover transition-colors ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                </div>
                <input
                  type="checkbox"
                  checked={draft.sections[sectionKey] ?? true}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      sections: { ...prev.sections, [sectionKey]: e.target.checked },
                    }))
                  }
                  className="cursor-pointer w-4 h-4 accent-brand transition-all"
                />
                <span className="text-text-primary select-none font-medium">{labelMap[key] || key}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
