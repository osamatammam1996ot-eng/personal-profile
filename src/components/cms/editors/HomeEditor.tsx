import type { CmsData } from '../../../types/cms';

import { VisibilityEditor } from './home/VisibilityEditor';
import { HeroEditor } from './home/HeroEditor';
import { WhyHireMeEditor } from './home/WhyHireMeEditor';
import { SkillsEditor } from './home/SkillsEditor';
import { ToolsEditor } from './home/ToolsEditor';
import { ContactEditor } from './home/ContactEditor';

interface HomeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  activeSection: string;
}

export function HomeEditor({ draft, updateDraft, activeSection }: HomeEditorProps) {
  const updateWhyCard = (index: number, updater: (card: CmsData['whyHireMe']['cards'][number]) => CmsData['whyHireMe']['cards'][number]) => {
    updateDraft((prev) => {
      const cards = [...prev.whyHireMe.cards];
      const base = cards[index] ?? {
        title: { en: '', ar: '' },
        desc: { en: '', ar: '' },
      };
      cards[index] = updater(base);
      return {
        ...prev,
        whyHireMe: {
          ...prev.whyHireMe,
          cards,
        },
      };
    });
  };

  const updateHeroRole = (index: number, lang: 'en' | 'ar', value: string) => {
    updateDraft((prev) => {
      const rolesEn = [...prev.hero.roles.en];
      const rolesAr = [...prev.hero.roles.ar];
      const target = lang === 'en' ? rolesEn : rolesAr;

      while (target.length <= index) {
        target.push('');
      }

      target[index] = value;

      return {
        ...prev,
        hero: {
          ...prev.hero,
          roles: {
            en: rolesEn,
            ar: rolesAr,
          },
        },
      };
    });
  };

  const addHeroRole = () => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        roles: {
          en: [...prev.hero.roles.en, ''],
          ar: [...prev.hero.roles.ar, ''],
        },
      },
    }));
  };

  const removeHeroRole = (index: number) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        roles: {
          en: prev.hero.roles.en.filter((_, i) => i !== index),
          ar: prev.hero.roles.ar.filter((_, i) => i !== index),
        },
      },
    }));
  };

  if (activeSection === 'home-visibility') {
    return <VisibilityEditor draft={draft} updateDraft={updateDraft} />;
  }

  if (activeSection === 'home-hero') {
    return (
      <HeroEditor 
        draft={draft} 
        updateDraft={updateDraft} 
        updateHeroRole={updateHeroRole} 
        addHeroRole={addHeroRole} 
        removeHeroRole={removeHeroRole} 
      />
    );
  }

  if (activeSection === 'home-whyhireme') {
    return <WhyHireMeEditor draft={draft} updateDraft={updateDraft} updateWhyCard={updateWhyCard} />;
  }

  if (activeSection === 'home-skills') {
    return <SkillsEditor draft={draft} updateDraft={updateDraft} />;
  }

  if (activeSection === 'home-tools') {
    return <ToolsEditor draft={draft} updateDraft={updateDraft} />;
  }

  if (activeSection === 'home-contact') {
    return <ContactEditor draft={draft} updateDraft={updateDraft} />;
  }

  return <p className="text-text-muted">Section editor not available.</p>;
}
