import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses } from '../../../../components/cms/shared/BilingualField';
import { Button } from '../../../ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface HeroEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  updateHeroRole: (index: number, lang: 'en' | 'ar', value: string) => void;
  addHeroRole: () => void;
  removeHeroRole: (index: number) => void;
}

export function HeroEditor({ draft, updateDraft, updateHeroRole, addHeroRole, removeHeroRole }: HeroEditorProps) {
  const elementOrder = draft.hero.elementOrder || ['avatar', 'label', 'headline', 'roles', 'desc', 'ctas'];

  const moveElement = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...elementOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    updateDraft(prev => ({ ...prev, hero: { ...prev.hero, elementOrder: newOrder } }));
  };

  const labels: Record<string, string> = {
    avatar: 'Avatar (3D Model)',
    label: 'Label Text',
    headline: 'Headline (Title)',
    roles: 'Roles Pill',
    desc: 'Description',
    ctas: 'Buttons (CTAs)'
  };

  const getVisibilityKey = (id: string): string | null => {
    switch(id) {
      case 'avatar': return 'showAvatar';
      case 'label': return 'showLabel';
      case 'headline': return 'showHeadline';
      case 'desc': return 'showDesc';
      default: return null;
    }
  };

  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Hero Content</h2>
      <BilingualField
        label="Label"
        en={draft.hero.label.en}
        ar={draft.hero.label.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, label: { ...prev.hero.label, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, label: { ...prev.hero.label, ar: value } } }))}
      />
      <BilingualField
        label="Headline 1"
        en={draft.hero.headline1.en}
        ar={draft.hero.headline1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline1: { ...prev.hero.headline1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline1: { ...prev.hero.headline1, ar: value } } }))}
      />
      <BilingualField
        label="Headline 2"
        en={draft.hero.headline2.en}
        ar={draft.hero.headline2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline2: { ...prev.hero.headline2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline2: { ...prev.hero.headline2, ar: value } } }))}
      />
      <BilingualField
        label="Description"
        multiline
        en={draft.hero.desc.en}
        ar={draft.hero.desc.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, desc: { ...prev.hero.desc, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, desc: { ...prev.hero.desc, ar: value } } }))}
      />
      <BilingualField
        label="Primary CTA"
        en={draft.hero.cta1.en}
        ar={draft.hero.cta1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta1: { ...prev.hero.cta1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta1: { ...prev.hero.cta1, ar: value } } }))}
      />
      <BilingualField
        label="Secondary CTA"
        en={draft.hero.cta2.en}
        ar={draft.hero.cta2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta2: { ...prev.hero.cta2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, hero: { ...prev.hero, cta2: { ...prev.hero.cta2, ar: value } } }))}
      />

      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-3">
          <p className="m-0 text-text-primary font-bold text-base tracking-wide">Roles</p>
          <button
            type="button"
            onClick={addHeroRole}
            className="bg-brand/20 hover:bg-brand/40 text-brand-hover border border-brand/50 rounded-lg px-3 py-1.5 text-sm font-bold cursor-pointer transition-colors"
          >
            + Add role
          </button>
        </div>

        <div className="grid gap-2.5">
          {Array.from({ length: Math.max(draft.hero.roles.en.length, draft.hero.roles.ar.length, 1) }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end"
            >
              <div>
                <label className="block text-sm font-bold text-text-muted mb-1 uppercase tracking-wider">English</label>
                <input
                  type="text"
                  value={draft.hero.roles.en[index] || ''}
                  onChange={(e) => updateHeroRole(index, 'en', e.target.value)}
                  className="w-full bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-base text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-text-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-muted mb-1 uppercase tracking-wider text-right" dir="rtl">عربي</label>
                <input
                  type="text"
                  dir="rtl"
                  value={draft.hero.roles.ar[index] || ''}
                  onChange={(e) => updateHeroRole(index, 'ar', e.target.value)}
                  className="w-full bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-base text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-text-muted/50"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-[38px] w-[38px]"
                onClick={() => removeHeroRole(index)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClasses}>
        <p className="m-0 text-text-primary font-bold text-base tracking-wide mb-3">Layout & Visibility</p>
        <p className="text-sm text-text-muted mb-4">Reorder elements or hide them completely.</p>
        <div className="flex flex-col gap-2">
          {elementOrder.map((id, index) => {
            const visibilityKey = getVisibilityKey(id);
            // @ts-ignore - dynamic key access
            const isVisible = visibilityKey ? (draft.hero[visibilityKey] ?? true) : true;
            
            return (
              <div key={id} className="flex items-center justify-between bg-surface-elevated border border-border-default rounded-lg px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveElement(index, 'up')}
                      disabled={index === 0}
                      className="text-text-muted hover:text-brand disabled:opacity-30 disabled:hover:text-text-muted transition-colors cursor-pointer"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveElement(index, 'down')}
                      disabled={index === elementOrder.length - 1}
                      className="text-text-muted hover:text-brand disabled:opacity-30 disabled:hover:text-text-muted transition-colors cursor-pointer"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <span className="font-medium text-text-primary">{labels[id]}</span>
                </div>
                
                {visibilityKey && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => updateDraft(prev => ({
                        ...prev,
                        hero: { ...prev.hero, [visibilityKey]: e.target.checked }
                      }))}
                      className="cursor-pointer w-4 h-4 accent-brand transition-all"
                    />
                    <span className="text-sm text-text-muted">Visible</span>
                  </label>
                )}
                {!visibilityKey && (
                  <span className="text-xs text-text-muted uppercase tracking-wider bg-surface px-2 py-1 rounded">Always Visible</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
