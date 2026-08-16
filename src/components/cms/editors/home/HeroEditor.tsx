import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses } from '../../../../components/cms/shared/BilingualField';
import { Button } from '../../../ui/button';

interface HeroEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  updateHeroRole: (index: number, lang: 'en' | 'ar', value: string) => void;
  addHeroRole: () => void;
  removeHeroRole: (index: number) => void;
}

export function HeroEditor({ draft, updateDraft, updateHeroRole, addHeroRole, removeHeroRole }: HeroEditorProps) {
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
          <p className="m-0 text-text-primary font-bold text-[13px] tracking-wide">Roles</p>
          <button
            type="button"
            onClick={addHeroRole}
            className="bg-brand/20 hover:bg-brand/40 text-brand-hover border border-brand/50 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors"
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
                <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase tracking-wider">English</label>
                <input
                  type="text"
                  value={draft.hero.roles.en[index] || ''}
                  onChange={(e) => updateHeroRole(index, 'en', e.target.value)}
                  className="w-full bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-text-muted/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted mb-1 uppercase tracking-wider text-right" dir="rtl">عربي</label>
                <input
                  type="text"
                  dir="rtl"
                  value={draft.hero.roles.ar[index] || ''}
                  onChange={(e) => updateHeroRole(index, 'ar', e.target.value)}
                  className="w-full bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-text-muted/50"
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
    </div>
  );
}
